#!/usr/bin/env node

const program = require('commander');
const startup = require('./index');

program
  .command('build <source>')
  .description('build site')
  .option('-w, --watch', 'watch the folder')
  .action(source => startup(source));

program.parse(process.args);
