export const initTools = () => {
  Omegga.on('cmd:recomponent', async (name: string, ...tagRaw: string[]) => {
    const player = Omegga.getPlayer(name);
    if (!player.isHost()) return;

    const tag = tagRaw.join(' ');
    if (!tag) return;

    try {
      const data = await player.getTemplateBoundsData();
      if (!data || data.version !== 10) return;

      for (const brick of data.bricks) {
        if (!('BCD_Interact' in brick.components)) continue;
        brick.components.BCD_Interact.ConsoleTag = tag;
        brick.components.BCD_Interact.Message = '';
      }

      await player.loadSaveData(data);
    } catch (err) {
      console.error('error in recomponent', err);
    }
  });

  Omegga.on('cmd:addcomponent', async (name: string, ...tagRaw: string[]) => {
    const player = Omegga.getPlayer(name);
    if (!player.isHost()) return;

    const tag = tagRaw.join(' ');
    if (!tag) return;

    try {
      const data = await player.getTemplateBoundsData();
      if (!data || data.version !== 10) return;

      for (const brick of data.bricks) {
        if (!('BCD_Interact' in brick.components)) {
          brick.components.BCD_Interact = {
            ConsoleTag: tag,
            Message: '',
            bPlayInteractSound: true,
          };
        }
      }

      delete data.components;

      await player.loadSaveData(data);
    } catch (err) {
      console.error('error in addcomponent', err);
    }
  });

  Omegga.on(
    'cmd:replacecomponent',
    async (name: string, a: string, b: string) => {
      const player = Omegga.getPlayer(name);
      if (!player.isHost()) return;

      if (!a || !b) return;

      try {
        const data = await player.getTemplateBoundsData();
        if (!data || data.version !== 10) return;

        for (const brick of data.bricks) {
          if ('BCD_Interact' in brick.components) {
            brick.components.BCD_Interact.ConsoleTag =
              brick.components.BCD_Interact.ConsoleTag.replace(a, b);
          }
        }

        delete data.components;

        await player.loadSaveData(data);
      } catch (err) {
        console.error('error in replacecomponent', err);
      }
    }
  );

  Omegga.on('cmd:rescale', async (name: string, scaleRaw: string) => {
    const player = Omegga.getPlayer(name);
    if (!player.isHost()) return;

    const scale = Number(scaleRaw);
    if (!scale || Number.isNaN(scale)) return;

    try {
      const data = await player.getTemplateBoundsData();
      if (!data || data.version !== 10) return;

      for (const brick of data.bricks) {
        if (!('BCD_ItemSpawn' in brick.components)) continue;
        brick.components.BCD_ItemSpawn.PickupScale = scale;
      }

      await player.loadSaveData(data);
    } catch (err) {
      console.error('error in rescale', err);
    }
  });

  Omegga.on('cmd:fixpickup', async (name: string) => {
    const player = Omegga.getPlayer(name);
    if (!player.isHost()) return;

    try {
      const data = await player.getTemplateBoundsData();
      if (!data || data.version !== 10) return;

      for (const brick of data.bricks) {
        if (!('BCD_ItemSpawn' in brick.components)) continue;
        brick.components.BCD_ItemSpawn.bPickupEnabled = true;
        brick.components.BCD_ItemSpawn.bPickupAutoDisableOnPickup = true;
        brick.components.BCD_ItemSpawn.bPickupRespawnOnMinigameReset = false;
        brick.components.BCD_ItemSpawn.PickupRespawnTime = 0;
        brick.components.BCD_ItemSpawn.PickupMinigameResetRespawnDelay = 0;
      }

      await player.loadSaveData(data);
    } catch (err) {
      console.error('error in fixpickup', err);
    }
  });

  return [
    'recomponent',
    'addcomponent',
    'replacecomponent',
    'rescale',
    'fixpickup',
  ];
};
