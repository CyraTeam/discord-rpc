'use strict';

const RpcError = require('../lib/error/RpcError');
const { getRandomValues } = require('node:crypto');

let register;
try {
  const { app } = require('electron');
  register = app.setAsDefaultProtocolClient.bind(app);
} catch (err) {
  try {
    register = require('register-scheme');
  } catch (e) {
    throw new RpcError(); // eslint-disable-line no-empty
  };
};

if (typeof register !== 'function') {
  register = () => false;
};

function pid() {
  if (typeof process !== 'undefined') {
    return process.pid;
  };
  return null;
};

const uuid4122 = () => {
  const randomValues = new Uint8Array(16);
  getRandomValues(randomValues);

  randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
  randomValues[8] = (randomValues[8] & 0x3f) | 0x80;
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    if (i === 4 || i === 6 || i === 8 || i === 10) {
      uuid += '-';
    };
    uuid += randomValues[i].toString(16).padStart(2, '0');
  };
  return uuid;
};

module.exports = {
  pid,
  register,
  uuid: uuid4122,
};
