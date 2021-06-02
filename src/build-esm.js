// @ts-check
const events = require('./events');
app.on(`${events.BUILD}:esm`, (file, modules_dir, verbose = false) => {

  const fs = require('fs');
  const path = require('path');
  const acorn = require('acorn');
  const walk = require('estree-walker').walk;
  const MagicString = require('magic-string');
  const chalk = require('chalk');
  const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
  const cache = {};

  function copy(module) {
    if (!cache[module]) {
      const jsonfile = require('jsonfile')
      const pkg = jsonfile.readFileSync(`./node_modules/${module}/package.json`)
      const source = pkg['module'] || pkg['main'];
      const esm = `${module}/${source}`;
      require('esbuild').buildSync({
        entryPoints: [`./node_modules/${module}/${source}`],
        outfile: `${modules_dir}/${esm}`,
        bundle: true,
        format: 'esm'
      });
      cache[module] = `"/_modules/${esm}"`;
    }
    return cache[module];
  }

  function fix(module) {
    let esm = module;
    if (
      module.startsWith('/') ||
      module.startsWith('./') ||
      module.startsWith('../')
    ) {
      verbose && console.log(gray(`\t${module} => ${esm}`));
    } else {
      esm = `${modules_dir}/${module}`;
      return copy(module);
    }
  }

  let hasFix;
  let code = fs.readFileSync(file).toString();
  const ast = acorn.parse(code, { sourceType: 'module', ecmaVersion: 11 });

  const magicString = new MagicString(code);
  verbose && console.log(green(`Checking: ${file}`));
  walk(ast, {
    enter(node, parent) {
      if (node.type === 'Literal' && parent.type === 'ImportDeclaration') {
        const esm = fix(node.value);
        if (esm) {
          magicString.overwrite(node.start, node.end, esm, {
            storeName: false
          });
          hasFix = true;
        }
        return node;
      }
    }
  });

  if (hasFix) {
    fs.writeFileSync(file, magicString.toString());
    // fs.writeFileSync(
    //   file + '.map',
    //   magicString.generateMap({
    //     file,
    //     includeContent: true,
    //     hires: true
    //   })
    // );
  }
});



