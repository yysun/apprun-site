# AppRun Site CLI

![logo](logo.png)

## Introduction

[AppRun](https://apprun.js.org) is a Javascript library for building reliable, high-performance web applications using the Elm inspired Architecture, events, and components.

**AppRun Site CLI** is a tool to create an [AppRun Site](apprun-site), an application framework for AppRun, which has structure that has the following structure:

```
public/
src/
  components/
  layout/
    Layout.tsx
    index.html
    style.css
  pages/
    _lib
      index.ts
    home/
    contact/
    about/
  config.json
  index.ts
```

## Quick Start

To create an AppRun Site:

```sh
npx apprun-site init my-apprun-site
cd my-apprun-site
npm install
```

Then, you can use:

* Use _npm start_ to start the dev server
* Use _npm run build_ to build for production


## Ready for More Information

* You can find out AppRun Site [features](/features) of  and  [how it works](/how-it-works).


