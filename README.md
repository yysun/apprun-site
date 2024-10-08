## AppRun Site

[AppRun-Site](https://github.com/yysun/apprun-site) is a server with [command-line tool](#command-line) for building modern web applications with [AppRun](https://github.com/yysun/apprun).  It has following features:

* You can [create web pages](#quick-start) using AppRun components and markdown
* [Build](#build) your pages to dynamic modules and load them on demand
* Render your pages to create a [static website](#static-website)
* [Serve](#serve) Single Page Applications (SPA) and Server-Side Rendering (SSR)
* [File-based routing](#file-based-routing)
* [API endpoints](#api-endpoints)
* [Server-side functions](#server-side-functions)


## Quick Start

To create a new AppRun Site, run `npx apprun-site init`.

The `init` command provides a few more project templates to choose from:

* [AppRun Site Basic](https://github.com/apprunjs/apprun-site-template)
* [AppRun Site with Shadcn/ui](https://github.com/apprunjs/apprun-shadcn)
* [AppRun Site with Ant Design](https://github.com/apprunjs/apprun-antd-pro)

An AppRun-Site project has the following structure:

```
/pages              <- pages of the website
  /index.html       <- index file
  /index.tsx        <- home page
  /main.tsx         <- start up code (registers web component and renders the layout)
  /about
    /index.tsx      <- about page
  /contact
    /index.tsx      <- contact page
```

The pages are tsx/jsx files (AppRun components).

```tsx
// pages/[page]/index.tsx -- functional component
import app from 'apprun';
export default () => <>
  <p>This is a functional Component</p>
</>;
```

Or

```tsx
// pages/[page]/index.tsx -- class component
import { app, Component } from 'apprun';
export default class extends Component {
  view = () => <>
    <p>This is a class Component</p>
  </>;
}
```

Or markdown files:

```md
# Hello World
This is a markdown file
```

## How does it work?

### Build

The `npx apprun-site build` command compiles your code to the `public` folder. It generates the following files:

```
/pages              <- pages of the website
/public             <- static files (genegretd by the build command)
  /index.html       <- index page
  /main.js          <- start up code
  /about
    /index.js       <- about page
  /contact
    /index.js       <- contact page
/server.js          <- server code (genegretd for SPA and SSR)
```

### Static Website

The `npx apprun-site build --render` command renders your pages to create a static website in the `public` folder.

```
/public
  /_.html           <- /defualt page for SPA
  /index.html       <- rendered home page
  /main.js
  /index.js
  /about
    /index.html     <- rendered about page
    /index.js
  /contact
    /index.html     <- rendered contact page
    /index.js
/server.js          <- server code (genegretd for SPA and SSR)
```


You can deploy the `public` folder to any static file server.


### Serve

You can run the generated `server.js` file to serve the pages.

```sh
node server.js
```

Modify the `server.js` file to fit your needs. The compiler will not overwrite the `server.js` file if it already exists.


### File-based  Routing

When you run `node serve.js`, it starts a server that supports your code run as Single Page Applications (SPA) and supports Server-Side Rendering (SSR).

On both the client side and the server side, it loads the pages on demand as dynamic modules using thw following steps:

* load the index.html
* load the main.js (for the dynamic layout and the start up code)
* load the modules by path to render the pages:

```
/public
  /                 <- /index.js
  /about            <- /about/index.js
  /contact          <- /contact/index.js
```

> Note:
> * The main.js should create a layout and a div with the id `main-app` to render the pages.
> * The page modules should create a div with the id `[page]-app` for sub pages. E.g., /docs/index.js should create a div with the id `docs-app` for its sub pages if any.



### Server App

If you add server backend code, you can add an `app` folder with the following structure:

```
/app                <- app folder (backend code)
  /_                <- action folder
  /api              <- api folder
/pages              <- pages of the website
```

The `build` command will compile the server code to allow the API endpoints and server-side functions.

If you only want to build the server code, you can use the `--server-only` option:

```sh
npx apprun-site build --server-only
```

### API Endpoints

The `build` command generated `server.js` can serve API endpoints. You can add your API endpoints in the `api` folder.

The API endpoints are served at the path `/api/[endpoint]`. For example, the `api/hello.js` file will be served at `/api/hello`.

```js
// api/hello.js
export default (req, res) => {
  res.json({ hello: 'world' });
};
```

### Server-side functions

You can add server-side functions in the `_` folder. The server-side functions are served at the path `/_/[action]`. For example, the `_/comic.js` file will be served at `/_/comic`.

Use the `//#if server`, `//#else`, and `//#endif` comments to separate the server-side code from the client-side code. The compiler will strip out the server-side code from the client-side code and vice versa.

```js
// _/comic.js
import action from 'apprun-site/action.js';
export default async (data) => {
  //#if server
  const num = data?.num || Math.floor(Math.random() * 2990) + 1;
  const response = await fetch(`https://xkcd.com/${num}/info.0.json`);
  return response.json();
  //#else
  return action('comic', data);
  //#endif
}
```

The `action` function will POST to the `comic` action on the client side.

You can refer to the server-side action in the client-side code:

```tsx
// components/comic.tsx
import { app, Component } from 'apprun';
import comic from '../../app/_/comic';
export default class Comic extends Component {
  state = comic();
  view = ({ img, alt }) => img ? <img src={img} alt={alt} /> : `Loading...`;
}
```

The benefit of referring to the server-side code is that you can get type checking, code completion and goto-definition in your IDE.

## Command Line

You can add a few npm scripts to your `package.json` file:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "apprun-site dev",
    "build": "apprun-site build --clean",
    "render": "apprun-site build --render",
    "build:server": "apprun-site build --server-only",
    "build:client": "apprun-site build --client-only"
  }
}
```

Then you can run the following commands:

* _npm start_ to start the server
* _npm run dev_ to start the development
* _npm run build_ to build for production
* _npm run render_ to build a static website


## Documentation

Please visit https://apprun.js.org/docs/apprun-site



Have fun coding!
