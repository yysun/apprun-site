import fs from 'fs';
import path from 'path';

const assets = new Map();

export const clean = () => assets.clear();

const set = (key, content, type) => assets.set(key, { content, type });

export const get = (key)  => assets.get(key);

export const has = (key) => assets.has(key);

export const dump = (outputDir) => {
  for (const [key, asset] of assets.entries()) {
    const { content } = asset;
    const outputPath = path.join(outputDir, key);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
  }
}

export default { has, set, get, clean, dump };