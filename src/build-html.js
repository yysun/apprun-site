// @ts-check
const fs = require('fs');
const yaml = require('js-yaml');
const app = require('apprun').app;
const events = require('./events');

const fm_flag = '---';

app.on(`${events.BUILD_CONTENT}:html`, (file) => {
  const text = fs.readFileSync(file).toString();
  if (text.startsWith(fm_flag)) {
    const ss = text.split('---');
    // @ts-ignore
    if (ss.length > 2 && typeof ss[1]==='object') return {  ...yaml.load(ss[1]), content: ss[2] }
  }
  return { fn: {}, content: text };
});