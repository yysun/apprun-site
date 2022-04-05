To create a new AppRun Site:

  ```bash
  npx apprun-site init [project-name]
  cd [project-name]
  npm install
  ```

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

* _npm start_ to start the dev server
* _npm run build_ to build for production
* _npm run render_ to build a static website