//@ts-checK

const assets = new Map();

export const clean = () => assets.clear();

const set = (key, content, type) => {
  key = key.replace(/\\/g, '/');
  assets.set(key, { content, type });
}
export const get = (key)  => assets.get(key);

export const has = (key) => assets.has(key);

export const list = () => {
  for (const [key, asset] of assets.entries()) {
    const { type } = asset;

    console.log('vfs', key, type);
  }
}

export default { has, set, get, clean, list };