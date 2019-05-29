module.exports = function ({ source, target}) {

  const fs = require('fs'), path = require('path');
  const MarkdownIt = require('markdown-it');
  const md = new MarkdownIt();

  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ?
        walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  };

  source = source || 'src/pages';
  target = target || 'public/pages';

  const files = [];
  walkDir(source, function(filePath) {
    files.push(filePath.replace(/\\/g, '/'));
  });

  const ensure = dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const is_page = type => (type === '.tsx' || type === '.html' || type === '.md' || type === '.txt');

  const pages = files.map(file => {
    const name = path.basename(file).replace(/\.[^/.]+$/, "");
    const ext = path.extname(file);
    const dir = path.dirname(file).replace(source, '');
    if (name.startsWith('_')) return null;
    const public = target + dir;
    const sname = (name === 'index' ? path.basename(dir) : name) || '/';
    const relative = `${dir}/${name}`;

    switch (ext) {
      case '.md':
        ensure(public);
        let text = fs.readFileSync(file).toString();
        text = md.render(text);
        fs.writeFileSync(`${public}/${name}.html`, text);
        return [`${relative}`, `${relative}.html`, sname, ext]
      case '.tsx':
        return [`${relative}`, `.${relative}`, name, ext]
      default:
        ensure(public);
        fs.copyFileSync(`${file}`, `${public}/${name}${ext}`);
        return [`${relative}`, `${relative}${ext}`, sname, ext]
    }
  }).filter(p => p !== null);

  // console.log(pages);

  const f = fs.createWriteStream(`${source}/_index.tsx`);
  f.write('// this file is auto-generated\n');
  pages.forEach((p, idx) => {
    let [_, link, name, type] = p;
    if (type==='.tsx') f.write(`import ${name}_${idx} from '${link}';\n`);
  });
  f.write('export default [\n');
  pages.forEach((p, idx) => {
    let [_, link, name, type] = p;
    p[0] = p[0].replace('/index', '/');
    p[0] = p[0].replace(/\/$/g, '');
    p[0] = p[0] || '/';
    link = type === '.tsx' ? `${name}_${idx}` : `"${link}"`;
    is_page(type) && f.write(`\t["${p[0]}", ${link}],\n`);
  });
  f.write('] as (readonly [string, any])[];\n');

  f.write('export const links = [\n');
  pages.forEach(p => {
    const [evt, _, name, type] = p;
    if (!name.startsWith('_') && is_page(type)) {
      f.write(`\t{"link": "${evt}", "text": "${evt}"},\n`);
    }
  });
  f.write(']\n');
  f.end();

}