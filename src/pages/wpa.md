# Progressive Web Apps (WPA)

AppRun Site includes the service worker from [PWA Builder](https://www.pwabuilder.com/).

The service worker improves the performance of your app, and make it work offline. The advanced caching service worker allows you to configure files and routes that are cached in different manners (pre-cache, network/server first, cache first, etc.). The tool can be used to build a lightening fast app (even for dynamic content) that works offline.

## Register the Service Worker

To register the service worker, include the script in the header section of the **index.html** file.

```
<script src="sw-init.js"></script>
```

## Configure the Service Worker

To configure the service worker, open and edit the **sw.js** file.


```javascript
const CACHE = "pwabuilder-adv-cache";
const precacheFiles = [
  "index.html",
  "app.js",
  "style.css"
];

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "ToDo-replace-this-name.html";

const networkFirstPaths = [
  /* Add an array of regex of paths that should go network first */
  // Example: /\/api\/.*/
];

const avoidCachingPaths = [
  /* Add an array of regex of paths that shouldn't be cached */
  // Example: /\/api\/.*/
  /\/sockjs-node\/*/
];

```

