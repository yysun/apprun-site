// @ts-check
const fs = require('fs');
const path = require('path');

const app = require('apprun').app;
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
const events = require('./events');

const Content_Types = ['.md', '.html'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Media_Types = ['.png', '.gif'];

const last = arr => arr.reduce((acc, curr) => curr ? curr : acc);
const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

app.on(events.PRE_BUILD, () => {
  console.log('Build started, clean up ...');
  const { public } = app['config'];
  fs.rmSync(public, { recursive: true, force: true });
});

app.on(events.POST_BUILD, () => console.log('Build done.'))

app.on(events.BUILD, async () => {
  const { pages, public } = app['config'];
  console.log('Building:', public, pages);
  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  }
  walkDir(pages, file => process_file(file));
});


async function process_file(file) {
  const { pages, public, content_events, themePath } = app['config'];
  const dir = path.dirname(file).replace(pages, '');
  const name = path.basename(file).replace(/\.[^/.]+$/, '');
  const pub_dir = path.join(public, dir);
  const ext = path.extname(file);
  const event = content_events?.[ext] || ext;
  const view = name.split('.')[1];

  ensure(pub_dir);

  // console.log('Page: ', file, '=>', event);
  const text = fs.readFileSync(file).toString();
  if (Content_Types.indexOf(ext) >= 0) {
    const all_content = await app.query(`${events.BUILD}${event}`, text);
    const content = last(all_content);
    // console.log(content);
    if (!content) {
      console.log(red('Content load failed'));
      return;
    }

    const viewModule = require(themePath);
    const html = viewModule(content, view);
    if (html) {
      const target = path.join(pub_dir, name) + '.html';
      fs.writeFileSync(target, html);
      console.log(green(target));
    } else {
      console.log(red('Page creation failed '));
    }
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    const result = (await app.query(`${events.BUILD}.esbuild`, file, pub_dir))[0];
    result.errors.length && console.log(red(result.errors));
    result.warnings.length && console.log(red(result.warnings));
    console.log(green(path.join(public, dir, name) + '.js'));
  } else if (Media_Types.indexOf(ext) >= 0) {
    const dest = path.join(pub_dir, name) + ext;
    fs.copyFileSync(file, dest);
    console.log(green(dest));
  }
}
