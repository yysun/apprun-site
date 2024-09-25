## AppRun Site

[AppRun-Site](https://github.com/yysun/apprun-site) is a server plus command-line tool for building modern web applications with [AppRun](https://github.com/yysun/apprun).  It has following features:

* You can build web pages using AppRun components and markdown
* Compile your pages to dynamic modules and load them on demand
* Run as Single Page Applications (SPA) and Server-Side Rendering (SSR)
* Render your pages to create a static website
* File-based routing
* API endpoints
* Server-side actions


## Quick Start

To create a new AppRun Site, run `npx apprun-site init`.

An AppRun-Site project has the following structure:

```
/_                  <- action folder
/api                <- api folder
/pages              <- pages of the website
  /index.html       <- index page
  /index.tsx        <- home page
  /main.tsx         <- start up code (registers web component and renders the layout)
  /about
    /index.tsx      <- about page
  /contact
    /index.tsx      <- contact page
/public             <- static files (genegretd by the build command)
/server.js          <- server code (genegretd by the build command for SSR)
```

The pages can tsx/jsx files (AppRun components).

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
/public             <- pages of the website
  /index.html       <- index page
  /main.js          <- start up code (registers web component and renders the layout)
  /about
    /index.js       <- about page
  /contact
    /index.js       <- contact page
/server.js          <- server code (genegretd by the build command for SSR)
```

You can deploy the `public` folder to any static file server, such as GitHub Pages.

Or you can run the server.js file to serve the pages with SSR.

### File-based  Routing

When you run `npx apprun-site serve`, it starts a server that supports your code run as Single Page Applications (SPA) and supports Server-Side Rendering (SSR).

On both the client side and the server side, it loads the pages on demand as dynamic modules using thw following steps:

* load the index.html
* load the main.js
* load the modules by path to render the pages:

```
/               <- /index.js
/about          <- about/index.js
/contact        <- contact/index.js
```

> Note:
> * The main.js should create a layout and a div with the id `main-app` to render the pages.
> * The page modules should create a div with the id `[page]-app` for sub pages. E.g., /docs/index.js should create a div with the id `docs-app` for its sub pages.

### Static Website

The `npx apprun-site build --render` command renders your pages to create a static website in the `public` folder.

```
/index.html
/main.js
/index.js
/about
  /index.html
  /index.js
/contact
  /index.html
  /index.js
```

### API Endpoints

The `build` command also generates a server.js file that can be used to serve API endpoints. You can add your API endpoints in the `api` folder.

The API endpoints are served at the path `/api/[endpoint]`. For example, the `api/hello.js` file will be served at `/api/hello`.

```js
// api/hello.js
export default (req, res) => {
  res.json({ hello: 'world' });
};
```

### Server-side Actions

You can add server-side actions in the `_` folder. The server-side actions are served at the path `/_/[action]`. For example, the `_/comic.js` file will be served at `/_/comic`.

```js
// _/comic.js
import action from 'apprun-site/action.js';

const comic = async () => {
  //#if server
  let response = await fetch('https://xkcd.com/info.0.json');
  const current = await response.json();
  const num = Math.floor(Math.random() * current.num) + 1;
  response = await fetch(`https://xkcd.com/${num}/info.0.json`);
  return response.json();
  //#endif
}

// made available on the client side
export default action(comic, 'comic');
```

The `action` function is a wrapper for server-side actions. It will execute the action on the server side. It will generate a fetch call to the action on the client side. You can refer to the server-side action in your AppRun components:

```tsx
// components/comic.tsx
import { app, Component } from 'apprun';
import comic from '../_/comic.js';
export default class Comic extends Component {
  state = comic;
  view = ({ img, alt }) => img ? <img src={img} alt={alt} /> : `Loading...`;
}
```

The compiler will strip out the server-side code from the client-side code, noted by `//#if server` and `//#endif`. So, no server side code will be visible on the client side.


## Command Line

You can use:

* _npm init_ to create a new AppRun Site
* _npm start_ to start the preview server
* _npm run dev_ to start the dev server
* _npm run build_ to build for production
* _npm run render_ to build a static website


## Documentation

Please visit https://apprun.js.org/docs/apprun-site



Have fun coding!
