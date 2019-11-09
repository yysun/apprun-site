#!/usr/bin/env node
const cli = require('cac')();
const exec = require('child_process').exec;

module.exports = function ({ source, modules, verbose }) {
  const fs = require('fs');
  const path = require('path');
  const readPkg = require('read-pkg');
  const MagicString = require('magic-string');
  const { Parser } = require('acorn');
  const walk = require('estree-walker').walk;
  const chalk = require('chalk');
  const { cyan, yellow, blue, green, magenta, gray, red } = chalk;
  const cache = {};

  const ensure = dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  };

  source = source || '.';
  modules = modules || '_modules/';
  if (!modules.endsWith('/')) modules += '/';
  ensure(`${source}/${modules}`);

  let root = `/${path.basename(source)}/`;

  function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  }

  const files = [];
  walkDir(source, function (filePath) {
    if (filePath.endsWith('.js')) files.push(filePath);
  });

  files.forEach(file => {
    try {
      let code = fs.readFileSync(file).toString();

      const ast = Parser.parse(code, { sourceType: 'module', ecmaVersion: 11 });
      const magicString = new MagicString(code);
      let hasFix;
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
    } catch (e) {
      console.log(red(`Error: ${file}: ${e.message}.`));
    }
  });

  function copy(module) {
    if (!cache[module]) {
      const cwd = `./node_modules/${module}`;
      tgt = `${source}/${modules}${module}.js`;
      if (!fs.existsSync(tgt)) {
        let src = cwd + '.js';
        if (!fs.existsSync(src)) {
          const pkg = readPkg.sync({ cwd });
          const module_file = pkg.module || pkg.main;
          src = `${cwd}/${module_file}`;
        }
        exec(`npx rollup "${src}" --format esm --file "${tgt}"`),
          verbose && console.log(yellow(`\tCopied: ${module} => ${tgt}`));
      } else {
        verbose && console.log(gray(`\tSkipped: ${module} => ${tgt}`));
      }
      cache[module] = tgt;
    }
  }

  function fix(module) {
    let esm = module;
    if (
      module.startsWith('/') ||
      module.startsWith('./') ||
      module.startsWith('../')
    ) {
      // esm = module.replace('./', root);
      verbose && console.log(gray(`\t${module} => ${esm}`));
    } else {
      esm = `${root}${modules}${module}`;
      copy(module);
    }
    if (!esm.endsWith('js')) esm = esm + '.js';
    return `'${esm}'`;
  }
};
