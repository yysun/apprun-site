# References

## Init Command

The _init_ command downloads the AppRun Site template from https://github.com/apprunjs/apprun-starter

```
Usage:
  $ npx apprun-site init [targetDir]

Options:
  -r, --repo [repo]  repository, default: apprunjs/apprun-starter
  -h, --help         Display this message
  -v, --version      Display version number
```

## Build Command

The _build_ command converts the HTML file and markdown files under the **src/pages** directory into AppRun components and stores them under **src/_lib** directory.

Then the _build_ command creates the **src/_lib/index.tsx** to import all pages and exports the event-page mappings, which is used the main program **src/index.tsx**.

```
Usage:
  $ npx apprun-site build

Options:
  -r, --root [root]         event root, default /, you can make it #
  -s, --source [sourceDir]  source directory
  -t, --target [targetDir]  target directory
  -w, --watch               watch the folder
  -V, --verbose             show verbose diagnostic information
  -h, --help                Display this message
  -v, --version             Display version number
```
