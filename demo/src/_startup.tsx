 // Auto generated file - DON'T modify
import app from 'apprun';
app['config'] = {
  "site_name": "AppRun Site",
  "favicon": "assets/favicon.ico",
  "logo": "assets/logo.png",
  "copyright": "Copyright &copy; 2021 Yiyi Sun",
  "theme": {
    "name": "bootstrap"
  },
  "tabs": {
    "Home": null,
    "About": "about",
    "Contact": "contact"
  },
  "plugins": [
    "my-plugin.js"
  ],
  "root": "/",
  "site_url": "/",
  "nav": [
    {
      "link": "/",
      "text": "Home"
    },
    {
      "link": "/about",
      "text": "About"
    },
    {
      "link": "/contact",
      "text": "Contact"
    }
  ],
  "pages": [
    {
      "link": "/about/",
      "file": "about/index.html",
      "module": "about/index.esm.js"
    },
    {
      "link": "/contact/",
      "file": "contact/index.html",
      "module": "contact/index.esm.js",
      "element": "my-app"
    },
    {
      "link": "/",
      "file": "index.md",
      "module": "index.esm.js",
      "element": "my-app"
    }
  ]
}

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
}