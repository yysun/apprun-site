// @ts-check
const fs = require('fs');
const path = require('path');

const app = require('apprun').app;
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const events = require('./events');

app.on(events.BUILD_PAGE, (text, template) => {
  return text;
})