const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
const events = require('./events');

const HTML_Types = ['.html', '.htm'];
const Content_Types = ['.md', '.mdx', '.html', '.htm'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Copy_Types = ['.png', '.gif', '.json', '.css', '.svg', '.jpg', '.jpeg', '.ico'];

const { pages, clean, watch, public, content_events, source } = app['config'];

const last = arr => arr.reduce((acc, curr) => curr ? curr : acc);
const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
const relative = fname => fname.replace(source, '');

const conf = `${source}/apprun-site.yml`;
const config = fs.existsSync(conf) ? yaml.load(fs.readFileSync(conf)) : {};

app.on(events.PRE_BUILD, () => {
  if (clean) {
    fs.rmSync(public, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(public));
  }
});

app.on(events.POST_BUILD, async () => {

  app.run(`${events.BUILD}:startup`, config, public);
  console.log(cyan('Created File'), relative(`${public}/main.js`));

  console.log(cyan('Creating Static Files ...'));
  await app.query(`${events.BUILD}:static`, config, public);

  if (watch) {
    console.log(cyan('Watching ...'));
    const chokidar = require('chokidar');
    chokidar.watch(pages).on('all', (event, path) => {
      if (event === 'change') {
        // console.log(cyan('Change detected'), relative(path));
        process_file(path);
      }
    });
  } else {
    console.log(cyan('Build done.'))
  }
})

app.on(events.BUILD, async () => {
  const { pages } = app['config'];
  console.log(cyan('Build from'), relative(pages));
  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      if (f.startsWith('_')) {
        console.log(gray('Skip'), gray(relative(dirPath)));
        return;
      }
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  }
  walkDir(pages, file => process_file(file));
});

async function process_file(file) {
  const dir = path.dirname(file).replace(pages, '');
  const name = path.basename(file).replace(/\.[^/.]+$/, '');
  const ext = path.extname(file);
  const event = content_events?.[ext] || ext;
  const pub_dir = path.join(public, dir);
  ensure(pub_dir);

  const js_file = path.join(public, dir, name) + '.js';

  // console.log('Page: ', file, '=>', event);
  const text = fs.readFileSync(file).toString();

  if (HTML_Types.indexOf(ext) >= 0 && text.indexOf('<html') >= 0) {
    const new_file = path.join(pub_dir, name + '.html');
    fs.writeFileSync(new_file, text);
    console.log(cyan('Copied HTML'), relative(new_file));
    return;
  }

  if (Content_Types.indexOf(ext) >= 0) {
    const all_content = await app.query(`${events.BUILD}${event}`, text);
    const content = last(all_content);
    // console.log(content);
    if (!content) {
      console.log(red('Content load failed'));
      return;
    }
    app.run(`${events.BUILD}:component`, content, js_file, public);
    app.run(`${events.BUILD}:add-route`, dir, js_file, public);
    console.log(cyan('Created Component'), relative(js_file));
  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    app.run(`${events.BUILD}:esbuild`, file, js_file, public);
    console.log(cyan('Compiled JavaSript'), relative(js_file));
    app.run(`${events.BUILD}:add-route`, dir, js_file, public);
  } else if (Copy_Types.indexOf(ext) >= 0) {
    const dest = path.join(pub_dir, name) + ext;
    fs.copyFileSync(file, dest);
    console.log(cyan('Copied File'), relative(dest));
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }
}
