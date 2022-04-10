[AppRun-Site](https://github.com/yysun/apprun-site) is a command-line tool for building modern web applications with [AppRun](https://github.com/yysun/apprun).  It consists of three features:

* A build command compiles your code to ES Modules with [esbuild](https://esbuild.github.io/)
* A build command option renders your pages to create a static website
* A development server that supports your code run as Single Page Applications (SPA) and supports Server-Side Rendering (SSR)

It allows you to build website pages using HTML, markdown, and AppRun components.

An AppRun-Site project has the following structure:

```
/public             <- static website
/pages              <- pages of the website
  /index.html       <- index page
  /index.md         <- home page
  /main.tsx         <- start up code (registers web component and renders the layout)
/components         <- optional
/api                <- optional
```

You can add pages to the directory `pages`; they can be HTML files, markdown files, and tsx/jsx files (AppRun components).

Then, you can use:

* _npm start_ or _npm run dev_ to start the dev server
* _npm run build_ to build for production
* _npm run render_ to build a static website

Have fun!
