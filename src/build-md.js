//@ts-check
import { readFileSync } from 'fs';
import _md from 'markdown-it';

export const markdown = (file) => {
  const text = readFileSync(file).toString();
  const md = _md({ html: true });
  return md.render(text);
}