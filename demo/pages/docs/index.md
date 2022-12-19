To create a new AppRun Site, run `npm create apprun-app` command and select the `AppRun Site` template.

```sh
npm init apprun-app [my-app]
```


An AppRun-Site project has the following structure:

```
/public             <- static website
/pages              <- pages of the website
  /index.html       <- index page
  /index.md         <- home page
  /main.tsx         <- start up code (registers web component and renders the layout)
/api                <- optional
```

You can add pages to the directory `pages`; they can be HTML files, markdown files, and tsx/jsx files (AppRun components).

Then, you can use:

* _npm start_ or _npm run dev_ to start the dev server
* _npm run build_ to build for production
* _npm run render_ to build a static website