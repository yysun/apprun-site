# References

## Init Command

```
Usage:
  $ npx apprun-site init [targetDir]

Options:
  -r, --repo [repo]  repository, default: apprunjs/apprun-starter
  -h, --help         Display this message
  -v, --version      Display version number
```

## Build Command

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

## Fix ESM Command

```
Usage:
  $ npx apprun-site fix-esm

Options:
  -m, --modules <modules>    Choose a directory for global modules (default: _modules)
  -V, --verbose             show verbose diagnostic information
  -s, --source [sourceDir]  source directory
  -h, --help                Display this message
  -v, --version             Display version number
```