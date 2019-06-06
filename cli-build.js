const app = require('apprun');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const md = require('markdown-it')({ html: true });
md.use(require('markdown-it-anchor'));
md.use(require('markdown-it-table-of-contents'));

const chalk = require('chalk');
const log = console.log;
const chokidar = require('chokidar');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const is_page = type => type === '.tsx' || type === '.html' || type === '.md' || type === '.txt';

const get_lib = source => `${path.dirname(source)}/_lib`; //?
const esm_dir = '/esm/_lib/'; //?

const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

function build(source, target, verbose) {
  // log(blue('Building: ' + `${source} => ${target}`));

  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  }
  const files = [];
  walkDir(source, function (filePath) {
    files.push(filePath);
  });

  return files.map(file => build_file(file, source, target, verbose)).filter(f => f !== null);
}

function build_file(file, source, target, verbose) {
  // log(blue('Building: ' + `${file}`))
  file = file.replace(/\\/g, '/');
  const lib = get_lib(source);
  const name = path.basename(file).replace(/\.[^/.]+$/, '');
  const ext = path.extname(file);
  const dir = path.dirname(file).replace(source, '');
  if (!name || name.startsWith('_')) return null;
  const public = target + dir;
  // const sname = (name === 'index' ? path.basename(dir) : name) || '/';
  const relative = `${dir}/${name}`;
  let tsx;

  switch (ext) {
    case '.html':
      let html = fs.readFileSync(file).toString();
      html = `import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => \`_html:${html}\`;
}`;
      tsx = `${dir}/${name}_html`;
      const html_filename = `${lib}${tsx}.tsx`;
      ensure(path.dirname(html_filename));
      fs.writeFileSync(`${html_filename}`, html);
      verbose && log(cyan(`Created file: ${file} => ${html_filename}`));
      return [relative, `.${tsx}`, `${name}_html`, '.tsx'];

    case '.md':
      let text = fs.readFileSync(file).toString();
      text = md.render(text);
      text = `import { app, Component } from 'apprun';
export default class extends Component {
  view = _ => \`_html:${text}\`;
}`;
      tsx = `${dir}/${name}_md`;
      const md_filename = `${lib}${tsx}.tsx`;
      ensure(path.dirname(md_filename));
      fs.writeFileSync(`${md_filename}`, text);
      verbose && log(green(`Created file: ${file} => ${md_filename}`));
      return [relative, `.${tsx}`, `${name}_md`, '.tsx'];

    case '.tsx':
      tsx = `${dir}/${name}_tsx`;
      const tsx_filename = `${lib}${tsx}.tsx`;
      ensure(path.dirname(tsx_filename));
      fs.copyFileSync(file, tsx_filename);
      verbose && log(gray(`Copied file: ${file} => ${tsx_filename}`));
      return [relative, `.${tsx}`, name, ext];

    default:
      ensure(public);
      fs.copyFileSync(file, `${public}/${name}${ext}`);
      verbose && log(yellow(`Copied file: ${file} => ${public}/${name}${ext}`));
      return null; // [relative, `${relative}${ext}`, sname, ext]
  }
}

function build_index(root, pages, source, verbose) {

  const lib = get_lib(source);

  // _lib/index.tsx
  let fn = `${lib}/index.tsx`;
  let f = fs.createWriteStream(`${fn}`);
  f.write('// this file is auto-generated\n');
  pages.forEach((p, idx) => {
    let [_, link, name, type] = p;
    link0 = `_${name}_${idx}`.replace(/\-/g, '_');
    if (type === '.tsx') f.write(`import ${link0} from '${link}';\n`);
  });
  f.write('export default [\n');
  pages.forEach((p, idx) => {
    let [_, link, name, type] = p;
    p[0] = p[0].replace('/index', '/');
    p[0] = p[0].replace(/\/$/g, '');
    p[0] = p[0] || '/';
    p[0] = root + p[0].substring(1);
    if (root.startsWith('#')) p[0] = p[0].replace(/\//g, '_')
    const link0 = type === '.tsx' ? `_${name}_${idx}`.replace(/\-/g, '_') : link;
    is_page(type) && f.write(`\t["${p[0]}", ${link0}],\n`);
  });
  f.write('] as (readonly [string, any])[];\n');
  verbose && log(magenta(`Created file: ${fn}`));

  // _lib/index-esm.tsx
  fn = `${lib}/index-esm.tsx`;
  f = fs.createWriteStream(`${fn}`);
  f.write('// this file is auto-generated\n');

  f.write('export default [\n');
  pages.forEach((p, idx) => {
    let [_, link, name, type] = p;
    if (type !== '.tsx') return;
    link0 = `_${name}_${idx}`.replace(/\-/g, '_');
    link = link.replace('./', esm_dir);
    f.write(`\t["${p[0]}", '${link0}', '${link}.js'],\n`);
  });
  f.write(']\n');
  verbose && log(magenta(`Created file: ${fn}`));
}

module.exports = function ({ root, source, target, verbose, watch }) {
  root = root || '/';
  root = root.replace(/\'|\"/g, '');
  source = source || 'src/pages';
  target = target || 'public';

  const lib = get_lib(source);
  ensure(lib);
  fse.emptyDirSync(lib);

  const build_all = () => {
    try {
      const pages = build(source, target, verbose);
      build_index(root, pages, source, verbose);
    } catch (ex) {
      log(red(ex.message))
    }
  }

  build_all();

  if (watch) {
    log(blue('Watching: ' + source + '... '));
    chokidar.watch(source, {
      ignored: `${get_lib(source)}/*`,
      ignoreInitial: true,
      ignorePermissionErrors: true,
      usePolling: true,
      interval: 500
    }).on('change', path => {
      build_file(path, source, target, verbose);
    }).on('add', _ => {
      build_all();
    }).on('unlink', _ => {
      build_all();
    })
  }
};
