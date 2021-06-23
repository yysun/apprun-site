const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { cyan, yellow, blue, green, magenta, gray, red } = chalk;

const events = require('./events');
// app.on(`${events.BUILD}:app`, () => {
//   const { source } = app;
//   const statup = ` // Auto generated file - DON'T modify
// import app from 'apprun';
// app['config'] = ${JSON.stringify(app.config, null, 2)}

// export default () => {
//   app['config'].components.forEach(def => {
//     let { link, module, element } = def;
//     app.on(link, (...p) => {
//       import(module).then((module) => {
//         const component = new module.default().mount(element);
//         component.run('.', ...p);
//       });
//     });
//   });
// }`;

//   // const config_file = path.join(source, 'src', '_startup.tsx');
//   // fs.writeFileSync(config_file, statup);
//   // console.log(cyan('Created Startup'), `src/_startup.js`);

// });

app.on(`${events.BUILD}:theme`, () => {
  const { cust_theme, sys_theme } = app;
  const { theme } = app.config;
  const cust_theme_js = path.join(cust_theme, `index.js`);
  const sys_theme_js = sys_theme + '.js';
  if (!fs.existsSync(cust_theme_js)) {
    fs.copyFileSync(sys_theme_js, cust_theme_js);
    console.log(cyan('Created Theme'), `${theme.name}/index.js`);
  } else {
    console.log(gray('Skipped Theme'), `${theme.name}/index.js`);
  }
});