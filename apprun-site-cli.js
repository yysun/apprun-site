#!/usr/bin/env node

const degit = require('degit')
const build = require('./cli-build')
const cli = require('cac')()

cli.command('build', 'build pages')
  .option('-w, --watch', 'watch the folder')
  .option('-s, --source [sourceDir]', 'source directory')
  .option('-t, --target [targetDir]', 'target directory')
  .action((options) => build(options))

cli.command('init [targetDir]', 'initialize project')
  .option('-r, --repo [repo]', 'source directory')
  .action((targetDir = '.', options) => {
    const repo = options.repo || 'apprunjs/apprun-starter'
    const emitter = degit(repo, {
      cache: true,
      force: false,
      verbose: true
    });
    emitter.on('info', info => console.log(info.message));
    emitter.clone(targetDir||'').then(() => console.log('done'))
  })


cli.help()
cli.version('0.1.0')
cli.parse()






