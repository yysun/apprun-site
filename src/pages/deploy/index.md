# Build and Deploy

## Build

AppRun Site provides all you need to use the bundled script file and dynamic ES modules loading.

* The _npx apprun-site build_ command creates the event-component-module mapping.

* The _npx apprun-site fix-esm_ command prepares the global modules for the browsers.

The _npm script_ in the AppRun Site app to compile and bundle is:

```sh
npm run build
```

The _npm script_ in the AppRun Site app to compile to ES modules is:

```sh
npm run build:esm

```

All the code and assets are built into the **public** directory.

## Deploy

AppRun Site apps are client side apps. All code runs in the browsers. There is no server side app needed. The deployment is to copy the  **public** directory to the web server.

