// @ts-check
const fs = require('fs');
const path = require('path');

const app = require('apprun').app;
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
const events = require('./events');

const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

app.on(events.PRE_BUILD, () => console.log('Build started'))
app.on(events.POST_BUILD, () => console.log('Build done.'))

app.on(events.BUILD, async () => {
  const { pages, public, content_types, themePath } = app['config'];
  console.log('Building', public);
  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  }
  walkDir(pages, async function (file) {
    const dir = path.dirname(file).replace(pages, '');
    const name = path.basename(file).replace(/\.[^/.]+$/, '');
    const target = path.join(public, dir, name) + '.html';
    const ext = path.extname(file);
    const type = content_types?.[ext] || ext.substr(1);
    const view = name.split('.')[1];

    console.log('Page: ', file, '=>', type);
    const text = fs.readFileSync(file).toString();
    if (['.md', '.html'].indexOf(ext) >= 0) {
      const content = (await app.query(`${events.BUILD}:${type}`, text))[0];
      if (!content) {
        console.log(red('Content load failed'));
        return;
      }
      // console.log(content);
      const viewModule = require(themePath);
      const html = viewModule(content, view);
      if (html) {
        ensure(path.dirname(target));
        fs.writeFileSync(target, html);
        console.log(green(target));
      } else {
        console.log(red('Page creation failed '));
      }
    } else {
      await app.query(`${events.BUILD}:${type}`, file, path.join(public, dir))
    }
  });

})
