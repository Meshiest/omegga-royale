import { odiff, vecAbs, vecAdd, vecScale, vecStr, vecSub } from 'src/math';
import { WriteSaveObject, Brick, Vector } from 'omegga';
import { encodeState } from './state';

export type Ring = {
  index: number;
  size: number;
  closeTime: number;
  waitPeriod: number;
  damagePerTick: number;
};

export type LootConfig = {
  types: Set<string>;
  chests: Record<string, Brick>;
  chestParts: Record<string, Brick[]>;
  loots: Record<string, { brick: Brick; weight: number }[]>;
  spawnPointers: Record<string, Record<string, number>>;
  rings: Ring[];
  map: { min: [number, number]; max: [number, number] };
  data: WriteSaveObject;
};

const {
  rotate: rotateBrick,
  getBounds,
  d2o,
  o2d,
  BRICK_CONSTANTS: { translationTable },
} = OMEGGA_UTIL.brick;

export function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

export function spawnLoot(
  config: LootConfig,
  chestType: string,
  position: Vector,
  orientation: number
): Brick {
  const pool = config.loots[chestType];
  const weights = Object.fromEntries(pool.map(({ weight }, i) => [i, weight]));
  const loot = pool[weightedRandom(weights)].brick;

  const newBrick = rotateBrick(
    { ...loot, position: [0, 0, 0] },
    o2d(odiff(d2o(loot.direction, loot.rotation), orientation)) as [
      number,
      number
    ]
  );
  if (newBrick.components.BCD_Interact) delete newBrick.components.BCD_Interact;
  newBrick.position = position;
  return newBrick;
}

export function spawnChest(
  config: LootConfig,
  chestType: string,
  spawnBrick: Brick
) {
  if (chestType === 'none') return [];

  const chest = config.chests[chestType];
  const spawnOrientation = d2o(spawnBrick.direction, spawnBrick.rotation);

  // spawn a chest at this brick's position
  const newBricks = [chest, ...config.chestParts[chestType]].map(b => {
    b = JSON.parse(JSON.stringify(b));
    b.position = vecSub(b.position, chest.position);
    b = rotateBrick(
      b,
      o2d(odiff(d2o(chest.direction, chest.rotation), spawnOrientation)) as [
        number,
        number
      ]
    );
    b.position = vecAdd(spawnBrick.position, b.position);
    return b;
  });

  const bounds = getBounds({
    bricks: newBricks,
    brick_assets: config.data.brick_assets,
  });

  const extent = vecAbs(
    vecScale(vecSub(bounds.minBound, bounds.maxBound), 0.5)
  );

  for (const b of newBricks) {
    b.components.BCD_Interact = {
      Message: '',
      bPlayInteractSound: true,
      ConsoleTag:
        `chest:${chestType}:` +
        encodeState({
          base: vecSub(spawnBrick.position, bounds.center),
          center: bounds.center,
          extent,
          orientation: spawnOrientation,
        }),
    };
  }

  return newBricks;
}

export type ChestSpawn = {
  center: Vector;
  extent: Vector;
  brick: Brick;
  weights: Record<string, number>;
};

/** extract chest spawn locations from a save object */
export function spawnsFromSave(
  config: LootConfig,
  data: WriteSaveObject
): ChestSpawn[] {
  const chests = [];

  for (const brick of data.bricks) {
    if (!('BCD_Interact' in brick.components)) continue;
    // bricks in config area
    if (
      Math.abs(brick.position[0]) <= 320 &&
      Math.abs(brick.position[1]) <= 320 &&
      Math.abs(brick.position[2]) <= 80
    )
      continue;

    const tag = brick.components.BCD_Interact.ConsoleTag;
    const [type, args] = tag.split(':');

    if (type !== 'brchestspawn') continue;

    const argMap =
      config.spawnPointers[args] ??
      Object.fromEntries(
        args
          .split(',')
          .filter(Boolean)
          .map(s => {
            const [a, b] = s.split('=');
            return [a, Number(b)];
          })
          .filter(a => a.length == 2)
      );

    if (Object.keys(argMap).length === 0) {
      console.warn(
        'a chest spawn is configured with no loot weights',
        vecStr(brick.position)
      );
      continue;
    }

    if (
      !Object.keys(argMap).every(
        type => type === 'none' || config.types.has(type)
      )
    ) {
      console.warn(
        "a chest spawn's type was not in chest config",
        [...config.types].join(','),
        Object.keys(argMap),
        vecStr(brick.position)
      );
      continue;
    }

    const brickSize = OMEGGA_UTIL.brick.getBrickSize(brick, data.brick_assets);
    chests.push({
      center: brick.position,
      extent: vecAbs(
        translationTable[d2o(brick.direction, brick.rotation)](brickSize)
      ),
      brick,
      weights: argMap,
    });
  }

  return chests;
}

export function weightedRandom(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((acc, w) => acc + w[1], 0);
  let random = Math.random() * total;
  for (const [entry, weight] of entries) {
    if (random < weight) return entry;
    random -= weight;
  }
  return null;
}
