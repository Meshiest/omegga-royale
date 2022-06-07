import { LootConfig } from './spawn';

const ringGridSize = 40;

export const ringId = (n: number) => ({
  id: '00000000-1111-111a-111c-' + n.toString(16).padStart(12, '0'),
  name: 'BR_GEN_' + n,
});

export type Point = [number, number];

// random point in a circle
const randPointInCircle = (center: Point, rad: number): Point => {
  const deg = Math.random() * Math.PI * 2;
  return [center[0] + Math.cos(deg) * rad, center[1] + Math.sin(deg) * rad];
};

export const renderRing = ([x, y]: Point, rad: number, id: number) => {
  rad = Math.round(rad / ringGridSize);
  x = Math.round(x / ringGridSize);
  y = Math.round(y / ringGridSize);
  const ringBricks = [];
  for (let i = -rad; i <= rad; i++) {
    for (let j = -rad; j <= rad; j++) {
      if (Math.round(Math.sqrt(i * i + j * j)) === rad) {
        ringBricks.push({
          color: [255, 255, 255],
          owner_index: id + 1,
          position: [(x + i) * ringGridSize, (y + j) * ringGridSize, 3500],
          size: [ringGridSize / 2, ringGridSize / 2, ringGridSize / 2],
        });
      }
    }
  }
  return ringBricks;
};

export const genRings = (config: LootConfig) => {
  const { min, max } = config.map;

  const center: Point = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2];
  const radius = Math.hypot(max[0] - min[0], max[1] - min[1]) / 2;

  const rings: [Point, number][] = [[center, radius]];

  for (let i = 1; i < config.rings.length; i++) {
    const [prevCenter, prevRad] = rings[i - 1];
    const newRad = rings[0][1] * config.rings[i].size;
    rings.push([
      randPointInCircle(prevCenter, (prevRad - newRad) * 0.8),
      newRad,
    ]);
  }

  return rings;
};
