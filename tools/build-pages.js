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
const files = [];
walkDir('src/pages', function(filePath) {
  files.push(filePath);
});

const pages = files.map(file => {
  const name = path.basename(file).replace(/\.[^/.]+$/, "");
  const ext = path.extname(file);
  const dir = path.dirname(file).substring(10);
  if (dir === '' && ext === '.tsx') return null;
  const public = 'public/pages/' + dir;
  if (!fs.existsSync(public)) {
    fs.mkdirSync(public), { recursive: true };
  }
  const sname = name === 'index' ? path.basename(dir) : name;
  const relative = `${dir}/${name}`;
  const hash = `#${relative}`;

  switch (ext) {
    case '.md':
      let text = fs.readFileSync(file).toString();
      text = md.render(text);
      fs.writeFileSync(`${public}/${name}.html`, text);
      return [`${hash}`, `pages/${relative}.html`, sname, ext]
    case '.ts':
    case '.tsx':
        return [`${hash}`, `./${relative}`, sname, ext]
    default:
      fs.copyFileSync(`${file}`, `${public}/${name}${ext}`);
      return [`${hash}`, `pages/${relative}${ext}`, sname, ext]
  }
}).filter(p => p !== null);

// console.log(pages);
const f = fs.createWriteStream('src/pages/index.tsx');
f.write('// this file is auto-generated\n');
pages.forEach((p, idx) => {
  let [_, link, name, type] = p;
  if (type==='.tsx') f.write(`import ${name}${idx} from '${link}';\n`);
});
f.write('export default [\n');
pages.forEach((p, idx) => {
  let [_, link, name, type] = p;
  p[0] = p[0].replace(/\//g, '-')
  p[0] = p[0].replace('-index', '')
  link = type === '.tsx' ? name+idx : `"${link}"`;
  f.write(`\t["${p[0]}", ${link}],\n`);
});
f.write('] as (readonly [string, any])[];\n');
f.write('export const sidebar = [\n');
pages.forEach(p => {
  const [evt, _, name] = p;
  if(!name.startsWith('_')) f.write(`\t{"link": "${evt}", "text": "${name}"},\n`);
});
f.write(']\n');
f.end();