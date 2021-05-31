import app from 'apprun';
import router from './router';

export default {
  start: (config) => {
    if (!config) config = { nav: [], pages: [], eventRoot: '/' };
    router(config);
    config.layout && app.render(document.body, <config.layout {...config} />);
    const element = config.element || document.body;
    config.pages.forEach(def => {
      const [route, Comp] = def;
      new Comp().mount(element, {route});
    });
  }
}
