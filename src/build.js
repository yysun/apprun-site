const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
const events = require('./events');

require('./build-md');
require('./build-html');
require('./build-ts');
require('./build-esm');
require('./build-component');
require('./build-app');

const Content_Types = ['.md', '.html'];
const Esbuild_Types = ['.js', '.jsx', '.ts', '.tsx'];
const Media_Types = ['.png', '.gif', '.json'];
const { content_events, site_url } = app['config'];
const { pages, public, clean, watch, cust_theme } = app;


const last = arr => arr.reduce((acc, curr) => curr ? curr : acc);
const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
const relative = fname => fname.replace(process.cwd(), '').substr(1);

app.on(events.PRE_BUILD, () => {
  if (clean) {
    fs.rmSync(public, { recursive: true, force: true });
    console.log(cyan('Clean'), relative(public));
  }

  ensure(cust_theme);
  app.run(`${events.BUILD}:theme`);
});

app.on(events.POST_BUILD, () => {
  app.run(`${events.BUILD}:app`);
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
  console.log(cyan('Build from'), relative(pages));
  app.config.pages = [];
  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      if (f.startsWith('_')) {
        console.log(gray('Ignored'), gray(relative(dirPath)));
        return;
      }
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  }
  walkDir(pages, file => process_file(file));
});

async function process_file(file) {
  const dir = path.dirname(file).replace(pages, '').substr(1);
  const name = path.basename(file).replace(/\.[^/.]+$/, '');
  const ext = path.extname(file);
  const event = content_events?.[ext] || ext;
  const modules_dir = `${public}/_modules`;
  const pub_dir = path.join(public, dir);
  ensure(modules_dir);
  ensure(pub_dir);

  // console.log('Page: ', dir, name, ext, '=>', event);
  const text = fs.readFileSync(file).toString();
  if (Content_Types.indexOf(ext) >= 0) {
    const all_content = await app.query(`${events.BUILD}${event}`, text);
    const page = last(all_content);
    // console.log(content);
    if (!page) {
      console.log(red('Content load failed'));
      return;
    }

    // create component
    const ss = name.split('.');
    const viewName = ss.length > 1 ? ss[1] : 'index';
    const pub_name = path.join(pub_dir, ss[0]);
    const component = `${path.join(pub_dir, name)}.esm.js`;

    app.run(`${events.BUILD}:component`, page, component);
    console.log(cyan('Created component'), relative(component));

    app.config.pages.push({
      link: site_url + (dir ? `${dir}/${ss[0]}` : ss[0]).replace('index', ''),
      file: dir ? `${dir}/${name}${ext}` : `${name}${ext}`,
      module: dir ? `${dir}/${name}.esm.js` : `${name}.esm.js`,
      element: page.meta.element
    });

    // create html file
    const viewPath = path.join(cust_theme, viewName);
    try {
      const view = require(viewPath);
      const html = view && view(page);
      const target = `${pub_name}.html`;
      fs.writeFileSync(target, html);
      console.log(cyan('Created Page'), relative(target));
    } catch (ex) {
      console.log(red('Error: Page creation failed'), relative(file));
      console.log(yellow(ex.code || ex), relative(viewPath));
    }

  } else if (Esbuild_Types.indexOf(ext) >= 0) {
    const js = `${path.join(pub_dir, name)}.js`;
    app.run(`${events.BUILD}:esbuild`, file, js);
    app.run(`${events.BUILD}:esm`, js, modules_dir);
    console.log(cyan('Created JavaSript'), relative(js));
  } else if (Media_Types.indexOf(ext) >= 0) {
    const dest = path.join(pub_dir, name) + ext;
    fs.copyFileSync(file, dest);
    console.log(cyan('Created Media'), relative(dest));
  } else {
    console.log(magenta('Unknown file type'), relative(file));
  }
}
