// @ts-check
const yaml = require('js-yaml');
const app = require('apprun').app;
const events = require('./events');

const fm_flag = '---';

app.on(`${events.BUILD}.html`, text => {
  if (text.startsWith(fm_flag)) {
    const ss = text.split('---');
    // @ts-ignore
    if (ss.length > 2) return {  ...yaml.load(ss[1]), content: ss[2] }
  }
  return { content: text };
});