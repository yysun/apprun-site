import { readFileSync } from 'fs';
import _md from 'markdown-it';
import { BUILD } from './events.js';

app.on('build:markdown', text => {
  const md = _md({ html: true });
  return text ? md.render(text) : '';
});

app.on('build:html', text => text);

app.on(`${BUILD}.md`, async (file) => {
  const text = readFileSync(file).toString();
  const all_content = await app.query('build:markdown', text);
  return all_content[all_content.length - 1];
});

app.on(`${BUILD}.html`, async (file) => {
  const text = readFileSync(file).toString();
  const all_content = await app.query('build:html', text);
  return all_content[all_content.length - 1];
});