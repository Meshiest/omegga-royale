import { Vector } from 'omegga';

const {
  BRICK_CONSTANTS: { orientationMap, rotationTable },
  d2o,
} = OMEGGA_UTIL.brick;

export const orientationMap2 = Object.fromEntries(
  Object.entries(orientationMap).map(([k, v]) => [k, d2o(...v)])
);

export const orientationStr = Object.fromEntries(
  Object.entries(orientationMap2).map(([k, v]) => [v, k])
);

export const inversionTable = [
  16, 19, 18, 17, 22, 23, 20, 21, 9, 1, 13, 5, 15, 7, 11, 3, 0, 12, 4, 8, 6, 10,
  2, 14, 17, 16, 19, 18, 23, 20, 21, 22, 10, 2, 14, 6, 12, 4, 8, 0, 1, 13, 5, 9,
  7, 11, 3, 15, 18, 17, 16, 19, 20, 21, 22, 23, 11, 3, 15, 7, 13, 5, 9, 1, 2,
  14, 6, 10, 4, 8, 0, 12, 19, 18, 17, 16, 21, 22, 23, 20, 8, 0, 12, 4, 14, 6,
  10, 2, 3, 15, 7, 11, 5, 9, 1, 13, 22, 23, 20, 21, 16, 19, 18, 17, 15, 7, 11,
  3, 9, 1, 13, 5, 4, 8, 0, 12, 2, 14, 6, 10, 23, 20, 21, 22, 17, 16, 19, 18, 12,
  4, 8, 0, 10, 2, 14, 6, 5, 9, 1, 13, 3, 15, 7, 11, 20, 21, 22, 23, 18, 17, 16,
  19, 13, 5, 9, 1, 11, 3, 15, 7, 6, 10, 2, 14, 0, 12, 4, 8, 21, 22, 23, 20, 19,
  18, 17, 16, 14, 6, 10, 2, 8, 0, 12, 4, 7, 11, 3, 15, 1, 13, 5, 9, 15, 7, 11,
  3, 9, 1, 13, 5, 16, 19, 18, 17, 22, 23, 20, 21, 8, 0, 12, 4, 10, 2, 14, 6, 12,
  4, 8, 0, 10, 2, 14, 6, 17, 16, 19, 18, 23, 20, 21, 22, 9, 1, 13, 5, 11, 3, 15,
  7, 13, 5, 9, 1, 11, 3, 15, 7, 18, 17, 16, 19, 20, 21, 22, 23, 10, 2, 14, 6, 8,
  0, 12, 4, 14, 6, 10, 2, 8, 0, 12, 4, 19, 18, 17, 16, 21, 22, 23, 20, 11, 3,
  15, 7, 9, 1, 13, 5, 9, 1, 13, 5, 15, 7, 11, 3, 22, 23, 20, 21, 16, 19, 18, 17,
  12, 4, 8, 0, 14, 6, 10, 2, 10, 2, 14, 6, 12, 4, 8, 0, 23, 20, 21, 22, 17, 16,
  19, 18, 13, 5, 9, 1, 15, 7, 11, 3, 11, 3, 15, 7, 13, 5, 9, 1, 20, 21, 22, 23,
  18, 17, 16, 19, 14, 6, 10, 2, 12, 4, 8, 0, 8, 0, 12, 4, 14, 6, 10, 2, 21, 22,
  23, 20, 19, 18, 17, 16, 15, 7, 11, 3, 13, 5, 9, 1, 0, 12, 4, 8, 2, 14, 6, 10,
  3, 15, 7, 11, 1, 13, 5, 9, 16, 19, 18, 17, 20, 21, 22, 23, 1, 13, 5, 9, 3, 15,
  7, 11, 0, 12, 4, 8, 2, 14, 6, 10, 17, 16, 19, 18, 21, 22, 23, 20, 2, 14, 6,
  10, 0, 12, 4, 8, 1, 13, 5, 9, 3, 15, 7, 11, 18, 17, 16, 19, 22, 23, 20, 21, 3,
  15, 7, 11, 1, 13, 5, 9, 2, 14, 6, 10, 0, 12, 4, 8, 19, 18, 17, 16, 23, 20, 21,
  22, 6, 10, 2, 14, 4, 8, 0, 12, 7, 11, 3, 15, 5, 9, 1, 13, 20, 21, 22, 23, 16,
  19, 18, 17, 7, 11, 3, 15, 5, 9, 1, 13, 4, 8, 0, 12, 6, 10, 2, 14, 21, 22, 23,
  20, 17, 16, 19, 18, 4, 8, 0, 12, 6, 10, 2, 14, 5, 9, 1, 13, 7, 11, 3, 15, 22,
  23, 20, 21, 18, 17, 16, 19, 5, 9, 1, 13, 7, 11, 3, 15, 6, 10, 2, 14, 4, 8, 0,
  12, 23, 20, 21, 22, 19, 18, 17, 16,
];

export const differenceTable = [
  16, 15, 22, 9, 18, 11, 20, 13, 17, 3, 21, 5, 19, 7, 23, 1, 0, 8, 4, 12, 6, 10,
  2, 14, 9, 16, 15, 22, 13, 18, 11, 20, 5, 17, 3, 21, 1, 19, 7, 23, 12, 0, 8, 4,
  14, 6, 10, 2, 22, 9, 16, 15, 20, 13, 18, 11, 21, 5, 17, 3, 23, 1, 19, 7, 4,
  12, 0, 8, 2, 14, 6, 10, 15, 22, 9, 16, 11, 20, 13, 18, 3, 21, 5, 17, 7, 23, 1,
  19, 8, 4, 12, 0, 10, 2, 14, 6, 18, 13, 20, 11, 16, 9, 22, 15, 19, 1, 23, 7,
  17, 5, 21, 3, 2, 10, 6, 14, 4, 8, 0, 12, 11, 18, 13, 20, 15, 16, 9, 22, 7, 19,
  1, 23, 3, 17, 5, 21, 14, 2, 10, 6, 12, 4, 8, 0, 20, 11, 18, 13, 22, 15, 16, 9,
  23, 7, 19, 1, 21, 3, 17, 5, 6, 14, 2, 10, 0, 12, 4, 8, 13, 20, 11, 18, 9, 22,
  15, 16, 1, 23, 7, 19, 5, 21, 3, 17, 10, 6, 14, 2, 8, 0, 12, 4, 19, 14, 21, 8,
  17, 10, 23, 12, 16, 2, 20, 4, 18, 6, 22, 0, 3, 11, 7, 15, 5, 9, 1, 13, 8, 19,
  14, 21, 12, 17, 10, 23, 4, 16, 2, 20, 0, 18, 6, 22, 15, 3, 11, 7, 13, 5, 9, 1,
  21, 8, 19, 14, 23, 12, 17, 10, 20, 4, 16, 2, 22, 0, 18, 6, 7, 15, 3, 11, 1,
  13, 5, 9, 14, 21, 8, 19, 10, 23, 12, 17, 2, 20, 4, 16, 6, 22, 0, 18, 11, 7,
  15, 3, 9, 1, 13, 5, 17, 12, 23, 10, 19, 8, 21, 14, 18, 0, 22, 6, 16, 4, 20, 2,
  1, 9, 5, 13, 7, 11, 3, 15, 10, 17, 12, 23, 14, 19, 8, 21, 6, 18, 0, 22, 2, 16,
  4, 20, 13, 1, 9, 5, 15, 7, 11, 3, 23, 10, 17, 12, 21, 14, 19, 8, 22, 6, 18, 0,
  20, 2, 16, 4, 5, 13, 1, 9, 3, 15, 7, 11, 12, 23, 10, 17, 8, 21, 14, 19, 0, 22,
  6, 18, 4, 20, 2, 16, 9, 5, 13, 1, 11, 3, 15, 7, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 3, 0, 1, 2, 7, 4, 5,
  6, 11, 8, 9, 10, 15, 12, 13, 14, 19, 16, 17, 18, 23, 20, 21, 22, 2, 3, 0, 1,
  6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13, 18, 19, 16, 17, 22, 23, 20, 21, 1,
  2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8, 13, 14, 15, 12, 17, 18, 19, 16, 21, 22, 23,
  20, 6, 5, 4, 7, 2, 1, 0, 3, 14, 13, 12, 15, 10, 9, 8, 11, 20, 23, 22, 21, 16,
  19, 18, 17, 7, 6, 5, 4, 3, 2, 1, 0, 15, 14, 13, 12, 11, 10, 9, 8, 21, 20, 23,
  22, 17, 16, 19, 18, 4, 7, 6, 5, 0, 3, 2, 1, 12, 15, 14, 13, 8, 11, 10, 9, 22,
  21, 20, 23, 18, 17, 16, 19, 5, 4, 7, 6, 1, 0, 3, 2, 13, 12, 15, 14, 9, 8, 11,
  10, 23, 22, 21, 20, 19, 18, 17, 16,
];

const relativeTable = [
  16, 17, 18, 19, 22, 23, 20, 21, 15, 12, 13, 14, 9, 10, 11, 8, 0, 1, 2, 3, 6,
  7, 4, 5, 15, 12, 13, 14, 9, 10, 11, 8, 22, 23, 20, 21, 16, 17, 18, 19, 1, 2,
  3, 0, 5, 6, 7, 4, 22, 23, 20, 21, 16, 17, 18, 19, 9, 10, 11, 8, 15, 12, 13,
  14, 2, 3, 0, 1, 4, 5, 6, 7, 9, 10, 11, 8, 15, 12, 13, 14, 16, 17, 18, 19, 22,
  23, 20, 21, 3, 0, 1, 2, 7, 4, 5, 6, 18, 19, 16, 17, 20, 21, 22, 23, 11, 8, 9,
  10, 13, 14, 15, 12, 4, 5, 6, 7, 2, 3, 0, 1, 11, 8, 9, 10, 13, 14, 15, 12, 20,
  21, 22, 23, 18, 19, 16, 17, 5, 6, 7, 4, 1, 2, 3, 0, 20, 21, 22, 23, 18, 19,
  16, 17, 13, 14, 15, 12, 11, 8, 9, 10, 6, 7, 4, 5, 0, 1, 2, 3, 13, 14, 15, 12,
  11, 8, 9, 10, 18, 19, 16, 17, 20, 21, 22, 23, 7, 4, 5, 6, 3, 0, 1, 2, 17, 18,
  19, 16, 21, 22, 23, 20, 3, 0, 1, 2, 5, 6, 7, 4, 8, 9, 10, 11, 14, 15, 12, 13,
  3, 0, 1, 2, 5, 6, 7, 4, 21, 22, 23, 20, 17, 18, 19, 16, 9, 10, 11, 8, 13, 14,
  15, 12, 21, 22, 23, 20, 17, 18, 19, 16, 5, 6, 7, 4, 3, 0, 1, 2, 10, 11, 8, 9,
  12, 13, 14, 15, 5, 6, 7, 4, 3, 0, 1, 2, 17, 18, 19, 16, 21, 22, 23, 20, 11, 8,
  9, 10, 15, 12, 13, 14, 19, 16, 17, 18, 23, 20, 21, 22, 7, 4, 5, 6, 1, 2, 3, 0,
  12, 13, 14, 15, 10, 11, 8, 9, 7, 4, 5, 6, 1, 2, 3, 0, 23, 20, 21, 22, 19, 16,
  17, 18, 13, 14, 15, 12, 9, 10, 11, 8, 23, 20, 21, 22, 19, 16, 17, 18, 1, 2, 3,
  0, 7, 4, 5, 6, 14, 15, 12, 13, 8, 9, 10, 11, 1, 2, 3, 0, 7, 4, 5, 6, 19, 16,
  17, 18, 23, 20, 21, 22, 15, 12, 13, 14, 11, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9, 10, 11,
  12, 13, 14, 15, 4, 5, 6, 7, 0, 1, 2, 3, 17, 18, 19, 16, 23, 20, 21, 22, 4, 5,
  6, 7, 0, 1, 2, 3, 12, 13, 14, 15, 8, 9, 10, 11, 18, 19, 16, 17, 22, 23, 20,
  21, 12, 13, 14, 15, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 19, 16, 17, 18, 21,
  22, 23, 20, 6, 7, 4, 5, 2, 3, 0, 1, 10, 11, 8, 9, 14, 15, 12, 13, 20, 21, 22,
  23, 16, 17, 18, 19, 10, 11, 8, 9, 14, 15, 12, 13, 2, 3, 0, 1, 6, 7, 4, 5, 21,
  22, 23, 20, 19, 16, 17, 18, 2, 3, 0, 1, 6, 7, 4, 5, 14, 15, 12, 13, 10, 11, 8,
  9, 22, 23, 20, 21, 18, 19, 16, 17, 14, 15, 12, 13, 10, 11, 8, 9, 6, 7, 4, 5,
  2, 3, 0, 1, 23, 20, 21, 22, 17, 18, 19, 16,
];
const relativeLookupTable = [
  16, 17, 18, 19, 22, 23, 20, 21, 15, 12, 13, 14, 9, 10, 11, 8, 0, 1, 2, 3, 6,
  7, 4, 5, 19, 16, 17, 18, 23, 20, 21, 22, 7, 4, 5, 6, 1, 2, 3, 0, 12, 13, 14,
  15, 10, 11, 8, 9, 18, 19, 16, 17, 20, 21, 22, 23, 11, 8, 9, 10, 13, 14, 15,
  12, 4, 5, 6, 7, 2, 3, 0, 1, 17, 18, 19, 16, 21, 22, 23, 20, 3, 0, 1, 2, 5, 6,
  7, 4, 8, 9, 10, 11, 14, 15, 12, 13, 22, 23, 20, 21, 16, 17, 18, 19, 9, 10, 11,
  8, 15, 12, 13, 14, 2, 3, 0, 1, 4, 5, 6, 7, 23, 20, 21, 22, 19, 16, 17, 18, 1,
  2, 3, 0, 7, 4, 5, 6, 14, 15, 12, 13, 8, 9, 10, 11, 20, 21, 22, 23, 18, 19, 16,
  17, 13, 14, 15, 12, 11, 8, 9, 10, 6, 7, 4, 5, 0, 1, 2, 3, 21, 22, 23, 20, 17,
  18, 19, 16, 5, 6, 7, 4, 3, 0, 1, 2, 10, 11, 8, 9, 12, 13, 14, 15, 9, 10, 11,
  8, 15, 12, 13, 14, 16, 17, 18, 19, 22, 23, 20, 21, 3, 0, 1, 2, 7, 4, 5, 6, 1,
  2, 3, 0, 7, 4, 5, 6, 19, 16, 17, 18, 23, 20, 21, 22, 15, 12, 13, 14, 11, 8, 9,
  10, 13, 14, 15, 12, 11, 8, 9, 10, 18, 19, 16, 17, 20, 21, 22, 23, 7, 4, 5, 6,
  3, 0, 1, 2, 5, 6, 7, 4, 3, 0, 1, 2, 17, 18, 19, 16, 21, 22, 23, 20, 11, 8, 9,
  10, 15, 12, 13, 14, 15, 12, 13, 14, 9, 10, 11, 8, 22, 23, 20, 21, 16, 17, 18,
  19, 1, 2, 3, 0, 5, 6, 7, 4, 7, 4, 5, 6, 1, 2, 3, 0, 23, 20, 21, 22, 19, 16,
  17, 18, 13, 14, 15, 12, 9, 10, 11, 8, 11, 8, 9, 10, 13, 14, 15, 12, 20, 21,
  22, 23, 18, 19, 16, 17, 5, 6, 7, 4, 1, 2, 3, 0, 3, 0, 1, 2, 5, 6, 7, 4, 21,
  22, 23, 20, 17, 18, 19, 16, 9, 10, 11, 8, 13, 14, 15, 12, 0, 1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 12, 13, 14,
  15, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 19, 16, 17, 18, 21, 22, 23, 20, 4,
  5, 6, 7, 0, 1, 2, 3, 12, 13, 14, 15, 8, 9, 10, 11, 18, 19, 16, 17, 22, 23, 20,
  21, 8, 9, 10, 11, 12, 13, 14, 15, 4, 5, 6, 7, 0, 1, 2, 3, 17, 18, 19, 16, 23,
  20, 21, 22, 6, 7, 4, 5, 2, 3, 0, 1, 10, 11, 8, 9, 14, 15, 12, 13, 20, 21, 22,
  23, 16, 17, 18, 19, 10, 11, 8, 9, 14, 15, 12, 13, 2, 3, 0, 1, 6, 7, 4, 5, 21,
  22, 23, 20, 19, 16, 17, 18, 2, 3, 0, 1, 6, 7, 4, 5, 14, 15, 12, 13, 10, 11, 8,
  9, 22, 23, 20, 21, 18, 19, 16, 17, 14, 15, 12, 13, 10, 11, 8, 9, 6, 7, 4, 5,
  2, 3, 0, 1, 23, 20, 21, 22, 17, 18, 19, 16,
];

export const applyTable = (table: number[], a: number, b: number) =>
  table[a * 24 + b];

export const orotate = (input: number, rotation: number) =>
  applyTable(rotationTable, input, rotation);
export const oinvert = (input: number, rotation: number) =>
  applyTable(inversionTable, input, rotation);
export const odiff = (input: number, output: number) =>
  applyTable(differenceTable, input, output);
export const orelative = (input: number, rotation: number) =>
  applyTable(relativeTable, input, rotation);
/** given input and output orientations, return the z+0 relative rotation */
export const olookup = (input: number, output: number) =>
  applyTable(relativeLookupTable, input, output);

export const vecStr = (a: number[]) => `[ ${a.join(', ')} ]`;

export const vecAdd = (a: Vector, b: Vector): Vector => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];

export const vecScale = (a: Vector, s: number): Vector => [
  a[0] * s,
  a[1] * s,
  a[2] * s,
];

export const vecAbs = (a: Vector): Vector => [
  Math.abs(a[0]),
  Math.abs(a[1]),
  Math.abs(a[2]),
];

export const vecSub = (a: Vector, b: Vector): Vector => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];

/** apply a relative rotation. used to build relativeTable
 * @param anchor the anchor for the relative rotation
 * @param rotation the rotation (applied to the input, relative to the anchor)
 * @param input input orientation
 * @returns input rotated by the amount the anchor was rotated by
 */
export function applyRelative(anchor: number, rotation: number, input: number) {
  const normalized = odiff(input, anchor);
  const rotated = orotate(normalized, rotation);
  const deNormalized = oinvert(rotated, normalized);
  return orotate(input, deNormalized);
}
