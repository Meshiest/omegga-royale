import { Vector } from 'omegga';

export type ChestState = {
  center: Vector;
  extent: Vector;
  base: Vector;
  orientation: number;
};

const BUFFER_SIZE = 27;

// generate a new version key
// don't forget to add/remove crypto from access.json
/*
const crypto = require('crypto');
console.debug(
  'keygen [',
  Array.from(crypto.randomBytes(BUFFER_SIZE)).join(', '),
  ']'
); */

const VERSION_KEY = [
  158, 64, 39, 219, 119, 247, 83, 74, 48, 244, 169, 149, 49, 119, 197, 128, 135,
  117, 8, 167, 172, 74, 165, 180, 91, 52, 247, 54, 153, 59,
];

export function readStateFromBuffer(buffer: ArrayBuffer) {
  let parity = 0;

  const dataview = new DataView(buffer);

  // apply version key to the buffer
  for (let i = buffer.byteLength - 1; i >= 0 && i < VERSION_KEY.length; i--) {
    dataview.setUint8(
      i,
      dataview.getUint8(i) ^
        VERSION_KEY[i] ^
        (i > 0 ? dataview.getUint8(i - 1) : 0)
    );
  }

  for (let i = 0; i < buffer.byteLength; i++) {
    if (i !== 1) parity ^= dataview.getUint8(i);
  }

  // parity failure
  if (parity !== dataview.getUint8(1)) {
    return null;
  }

  let bytes = 1;
  // version check
  if (dataview.getUint8(0) !== 111) return null;
  const state: ChestState = {
    center: [
      dataview.getInt32((bytes += 1)),
      dataview.getInt32((bytes += 4)),
      dataview.getInt32((bytes += 4)),
    ],
    extent: [
      dataview.getUint16((bytes += 4)),
      dataview.getUint16((bytes += 2)),
      dataview.getUint16((bytes += 2)),
    ],
    base: [
      dataview.getInt16((bytes += 2)),
      dataview.getInt16((bytes += 2)),
      dataview.getInt16((bytes += 2)),
    ],
    orientation: dataview.getUint8((bytes += 2)),
  };
  return state;
}

export function writeStateToBuffer(state: ChestState) {
  const buffer = new ArrayBuffer(BUFFER_SIZE);
  const dataview = new DataView(buffer);
  let bytes = 0;
  // 0th byte is version
  dataview.setUint8(0, 111);
  // 1st byte is parity
  bytes += 1;
  dataview.setInt32((bytes += 1), state.center[0]);
  dataview.setInt32((bytes += 4), state.center[1]);
  dataview.setInt32((bytes += 4), state.center[2]);
  dataview.setUint16((bytes += 4), state.extent[0]);
  dataview.setUint16((bytes += 2), state.extent[1]);
  dataview.setUint16((bytes += 2), state.extent[2]);
  dataview.setInt16((bytes += 2), state.base[0]);
  dataview.setInt16((bytes += 2), state.base[1]);
  dataview.setInt16((bytes += 2), state.base[2]);
  dataview.setUint8((bytes += 2), state.orientation);

  let parity = 0;
  for (let i = 0; i < buffer.byteLength; i++) {
    if (i !== 1) parity ^= dataview.getUint8(i);
  }
  dataview.setUint8(1, parity);

  // apply version key to buffer
  for (let i = 0; i < buffer.byteLength && i < VERSION_KEY.length; i++) {
    dataview.setUint8(
      i,
      dataview.getUint8(i) ^
        VERSION_KEY[i] ^
        (i > 0 ? dataview.getUint8(i - 1) : 0)
    );
  }

  return buffer;
}

export function decodeState(encoded: string) {
  const buffer = new Uint8Array(Buffer.from(encoded, 'base64')).buffer;
  if (buffer.byteLength !== BUFFER_SIZE) return null;
  return readStateFromBuffer(buffer);
}

export function encodeState(state: ChestState) {
  return Buffer.from(new Uint8Array(writeStateToBuffer(state))).toString(
    'base64'
  );
}
