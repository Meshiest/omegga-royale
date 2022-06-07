import { ChestSpawn } from './src/spawn';
/*

how to use:
load bricks from Builds>omegga>royale>chest config
/brconfig
copy the ramp crests (chest spawns)
/testspawn

TODO: add ownership to spawns
TODO: persist spawns in memory for easy reloading
TODO: ring logic
TODO: damage players outside rings

*/

import OmeggaPlugin, { Brick, OL, PC, PS, WriteSaveObject } from 'omegga';
import { vecAdd, vecStr } from 'src/math';
import { genRings, renderRing, ringId } from 'src/ring';
import {
  LootConfig,
  spawnChest,
  spawnLoot,
  spawnsFromSave,
  weightedRandom,
} from 'src/spawn';
import { decodeState } from 'src/state';
import { initTools } from 'src/tools';

type Config = {};
type Storage = {};

let config: LootConfig;

const SPAWN_OWNER = '00000000-1111-111a-111d-000000000000';

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    Omegga.on('cmd:brconfig', async (name: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;

      const tags = new Set();

      try {
        config = {
          types: new Set(),
          chests: {},
          chestParts: {},
          loots: {},
          rings: [],
          spawnPointers: {},
          map: null,
          data: null,
        };
        const protoRings: {
          brick: Brick;
          size: number;
          map: boolean;
          data: Record<string, number>;
        }[] = [];

        const data = await Omegga.getSaveData({
          center: [0, 0, 40],
          extent: [320, 320, 80],
        });
        if (!data || data.brick_count === 0) return;
        if (data.version !== 10) return;
        data.brick_owners[0] = {
          name: 'Royale',
          id: SPAWN_OWNER,
          bricks: 0,
        };
        delete data.components;
        config.data = data;

        for (const brick of data.bricks) {
          brick.owner_index = 1;
          if (!('BCD_Interact' in brick.components)) continue;

          const tag = brick.components.BCD_Interact.ConsoleTag;
          const [type, arg, extra] = tag.split(':');
          const argMap = Object.fromEntries(
            arg
              .split(',')
              .filter(Boolean)
              .map(s => {
                const [a, b] = s.split('=');
                const num = Number(b);
                return [a, Number.isNaN(num) ? b : num];
              })
              .filter(a => a.length == 2)
          );

          switch (type) {
            case 'brchest':
              config.types.add(arg);
              config.chests[arg] = brick;
              break;
            case 'brchestpart':
              config.types.add(arg);
              config.chestParts[arg] ??= [];
              config.chestParts[arg].push(brick);
              break;
            case 'brloot':
              const { weight = 1, type } = argMap;
              config.types.add(type);
              config.loots[type] ??= [];
              config.loots[type].push({ brick, weight });
              break;
            case 'mapsize':
              if (!('min' in argMap && 'max' in argMap)) break;

              const [minX, minY] = argMap.min.split('|').map(Number);
              const [maxX, maxY] = argMap.max.split('|').map(Number);

              config.map = {
                min: [minX, minY],
                max: [maxX, maxY],
              };

              break;
            case 'spawnptr':
              if (!extra) break;
              if (extra in config.spawnPointers) break;

              config.spawnPointers[extra] = argMap;
              break;
            case 'brring':
              protoRings.push({
                brick,
                size: Math.max(...brick.size),
                data: argMap,
                map: arg === 'map',
              });
              break;
          }

          tags.add(brick.components.BCD_Interact.ConsoleTag);
        }

        protoRings.sort((a, b) => a.brick.position[2] - b.brick.position[2]);
        const maxRingSize = Math.max(...protoRings.map(p => p.size));

        config.rings = protoRings.map((p, i) => ({
          index: i,
          size: p.size / maxRingSize,
          closeTime: p.data.time || 0,
          waitPeriod: p.data.wait || 0,
          damagePerTick: p.data.dmg || 0,
        }));

        Omegga.whisper(player, `types: ${[...config.types].join(', ')}`);
        Omegga.whisper(
          player,
          `chests: ${Object.keys(config.chests).join(', ')}`
        );
        Omegga.whisper(
          player,
          `chestsParts: ${Object.keys(config.chestParts).join(', ')}`
        );
        Omegga.whisper(
          player,
          `loots: ${Object.keys(config.loots).join(', ')}`
        );
        Omegga.whisper(player, `${config.rings.length} rings`);
        Omegga.whisper(
          player,
          `${Object.keys(config.spawnPointers).length} pointers`
        );
        if (config.map)
          Omegga.whisper(
            player,
            `map size: ${config.map.max[0] - config.map.min[0]}x${
              config.map.max[1] - config.map.min[1]
            }`
          );

        for (const type of config.types) {
          if (!(type in config.chests))
            Omegga.whisper(player, `type ${type} missing chest`);
          if (!(type in config.chestParts))
            Omegga.whisper(player, `type ${type} missing chestParts`);
          if (!(type in config.loots))
            Omegga.whisper(player, `type ${type} missing loot`);
        }
      } catch (err) {
        console.error('error in brconfig', err);
      }
    });

    Omegga.on('cmd:clearring', async (name: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;
      if (!config) return;

      for (let i = 0; i < config.rings.length; i++) {
        Omegga.clearBricks(ringId(i).id, true);
      }
    });

    Omegga.on('cmd:testring', async (name: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;
      if (!config) return;

      try {
        const rings = genRings(config);
        const brick_owners = Array.from({ length: rings.length }).map((_, i) =>
          ringId(i)
        );
        const ringBricks = rings.flatMap(([center, rad], i) =>
          renderRing(center, rad, i)
        );
        const data: WriteSaveObject = {
          brick_owners,
          bricks: [...ringBricks],
        };

        for (const o of brick_owners) {
          Omegga.clearBricks(o.id, true);
        }
        await Omegga.loadSaveData(data, { quiet: true });
      } catch (err) {
        console.error('error in testring', err);
      }
    });

    let spawns: ChestSpawn[];
    Omegga.on('cmd:parsemap', async (name: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;
      if (!config) return;

      try {
        const data = await Omegga.getSaveData();
        if (!data || data.version !== 10) return;

        spawns = spawnsFromSave(config, data);
        for (const spawn of spawns) {
          Omegga.clearRegion(spawn);
        }
        Omegga.whisper(player, `Found ${spawns.length} spawns`);
      } catch (err) {
        console.error('error in parsemap', err);
      }
    });

    Omegga.on('cmd:spawns', async (name: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;
      if (!config) return;

      const newData = { ...config.data, bricks: [] };

      Omegga.clearBricks(SPAWN_OWNER, true);
      for (const spawn of spawns) {
        // spawn a chest at this brick's position
        newData.bricks.push(
          ...spawnChest(config, weightedRandom(spawn.weights), spawn.brick)
        );
      }

      Omegga.whisper(player, `Loading ${newData.bricks.length} bricks`);

      if (newData.bricks.length === 0) return;
      Omegga.loadSaveData(newData, { quiet: true });
    });

    Omegga.on('cmd:testspawn', async (name: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;
      if (!config) return;

      try {
        const data = await player.getTemplateBoundsData();
        if (!data || data.version !== 10) return;

        const newData = { ...config.data, bricks: [] };

        const spawns = spawnsFromSave(config, data);

        for (const spawn of spawns) {
          Omegga.clearRegion(spawn);

          // spawn a chest at this brick's position
          newData.bricks.push(
            ...spawnChest(config, weightedRandom(spawn.weights), spawn.brick)
          );
        }

        if (newData.bricks.length === 0) return;
        Omegga.loadSaveData(newData, { quiet: true });
      } catch (err) {
        console.error('error in testspawn', err);
      }
    });

    const locks = new Set();
    Omegga.on('interact', async ({ player, message, position }) => {
      if (!config) return;
      const match = message.match(
        /^chest:(?<type>\w+):(?<base64>(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/
      );
      if (!match) return;

      if (!config.types.has(match.groups.type)) return;

      try {
        const parsed = decodeState(match.groups.base64);
        const key = vecStr(parsed.center);
        if (!parsed || locks.has(key)) return;
        locks.add(key);

        Omegga.clearRegion(parsed);
        await Omegga.loadSaveData(
          {
            ...config.data,
            bricks: [
              spawnLoot(
                config,
                match.groups.type,
                vecAdd(parsed.center, parsed.base),
                parsed.orientation
              ),
            ],
          },
          {
            quiet: true,
          }
        );
        locks.delete(key);
      } catch (err) {
        console.error('error parsing tag at', position, err);
        return;
      }
    });

    return {
      registeredCommands: [
        ...initTools(),
        'clearring',
        'brconfig',
        'testspawn',
        'testring',
        'parsemap',
        'spawns',
      ],
    };
  }

  async stop() {}
}
