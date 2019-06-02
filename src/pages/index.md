# AppRun Site CLI

![logo](logo.png)

## Introduction

[AppRun](https://apprun.js.org) is a Javascript library for building reliable, high-performance web applications using the Elm inspired Architecture, events, and components.

**AppRun Site CLI** is a tool to create an [AppRun Site](apprun-site), an application framework for AppRun.

AppRun Site lets you organize your code into well-planned directory structure as following:

```
public/
src/
  layout/
  pages/
    home/
    contact/
    about/
  config.json
  index.ts
```
It looks like a static site generator. However, don't use it to make a Blog site. AppRun Site an application framework that has the main design gaols are:

* Auto-generate the routing events
* Separate the layout and content
* Use web components


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

* You can find out [how it works](/how-it-works).


