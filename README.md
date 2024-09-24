## AppRun Site

[AppRun-Site](https://github.com/yysun/apprun-site) is a server and a command-line tool for building modern web applications with [AppRun](https://github.com/yysun/apprun).  It has following features:

* You can build web pages using AppRun components and markdown
* Compile your pages to dynamic modules and load them on demand
* Run as Single Page Applications (SPA) and Server-Side Rendering (SSR)
* Render your pages to create a static website
* File-based routing
* API endpoints
* Server-side actions


## Quick Start

To create a new AppRun Site, run `npx create-apprun-app` command and select the `AppRun Site` template.

```sh
npx create-apprun-app@latest [my-app]
```

An AppRun-Site project has the following structure:

```
/_                  <- action folder
/api                <- api folder
/pages              <- pages of the website
  /index.html       <- index page
  /index.tsx        <- home page
  /main.tsx         <- start up code (registers web component and renders the layout)
/public             <- static files (genegretd by the build command)
/server.js          <- server code (genegretd by the build command for SSR)
```

You can add pages to the directory `pages`; they can be markdown files, and tsx/jsx files (AppRun components).

Then, you can use:

* _npm start_ to start the preview server
* _npm run dev_ to start the dev server
* _npm run build_ to build for production
* _npm run render_ to build a static website


## Documentation

Please visit https://apprun.js.org/docs/apprun-site



Have fun coding!
