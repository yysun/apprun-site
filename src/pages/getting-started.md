# Getting Start

To create an AppRun Site:

```sh
npx apprun-site init my-apprun-site
cd my-apprun-site
npm install
```

The **init** command creates a project structure.

```
public/
src/
  layouts/
  layouts-bootstrap/
  layouts-coreui/
  layouts-material/
  pages/
    home.tsx
    contact.tsx
    about.tsx
  index.tsx
  tsconfig.json
.gitignore
package.json
webpack.config.js
```

Use _npm start_ to start the dev server and run the app in browser http://localhost:8080


You can modify the home, contact and about components. Or add a few your own. The dev server will refresh to show your changes on the fly.


Next, you can start to [configure the site](#configuration).


