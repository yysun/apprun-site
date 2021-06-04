const fs = require('fs');
const path = require('path');

const events = require('./events');
app.on(`${events.BUILD}:app`, components => {
  const config = app['config'];
  const source = config.source;
  config.components = components;
  ['source', 'pages', 'public', 'plugin', 'watch', 'clean'].forEach(n => delete config[n]);
  const statup = ` // Auto generated file - DON'T modify
import app from 'apprun';
app['config'] = ${JSON.stringify(config, null, 2)}

export default () => {
  app['config'].components.forEach(def => {
    let { link, module, element } = def;
    app.on(link, (...p) => {
      import(module).then((module) => {
        const component = new module.default().mount(element);
        component.run('.', ...p);
      });
    });
  });
}`;

  const config_file = path.join(source, 'src', '_startup.tsx');
  fs.writeFileSync(config_file, statup);
});