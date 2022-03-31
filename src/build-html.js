import { load } from 'js-yaml';
import { BUILD } from './events.js';

const fm_flag = '---';

app.on(`${BUILD}.html`, text => {
  if (text.startsWith(fm_flag)) {
    const ss = text.split('---');
    if (ss.length > 2) return {  ...load(ss[1]), content: ss[2] }
  }
  return { content: text };
});