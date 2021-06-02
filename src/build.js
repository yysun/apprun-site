const fs = require('fs');
const path = require('path');

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

const { pages, public, content_events, source } = app['config'];
const relative = fname => fname.replace(source, '');

app.on(events.PRE_BUILD, () => {
  console.log(cyan('Build started'), relative(public));
  fs.rmSync(public, { recursive: true, force: true });
});

app.on(events.POST_BUILD, () => console.log(cyan('Build done.')))

app.on(events.BUILD, async () => {
  const { pages, public } = app['config'];
  console.log(cyan('Build from'), relative(pages));
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
  const dir = path.dirname(file).replace(pages, '');
  const name = path.basename(file).replace(/\.[^/.]+$/, '');
  const pub_dir = path.join(public, dir);
  const ext = path.extname(file);
  const event = content_events?.[ext] || ext;

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

    const ss = name.split('.');
    const viewName = ss.length > 2 ? ss[1] : 'index';
    const view = app['get_theme_view'](viewName);
    const html = view && view(content);
    if (html) {
      const target = path.join(pub_dir, ss[0]) + '.html';
      fs.writeFileSync(target, html);
      console.log(cyan('Created Content'), relative(target));
    } else {
      console.log(red('Err: Page creation failed for', file));
    }
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    const js = path.join(public, dir, name) + '.js';
    app.run(`${events.BUILD}:esbuild`, file, js);
    app.run(`${events.BUILD}:esm`, js);
    console.log(cyan('Created JavaSript'), relative(js));
  } else if (Media_Types.indexOf(ext) >= 0) {
    const dest = path.join(pub_dir, name) + ext;
    fs.copyFileSync(file, dest);
    console.log(cyan('Created Media'), relative(dest));
  }
}
