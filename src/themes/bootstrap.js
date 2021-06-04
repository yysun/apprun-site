const { site_name, extra_css, extra_javascript, extra_module } = app['config'];

module.exports = page => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>${page.title ? page.title + ' | ' : ''}${site_name}</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
  ${extra_css ? extra_css.map(css => `<link rel="stylesheet" href="${css}">`).join('\n') : ''}
  ${extra_javascript ? extra_javascript.map(js => `<script src="${js}"></script>`).join('\n') : ''}
  ${extra_module ? extra_module.map(js => `<script src="${js}" type="module"></script>`).join('\n') : ''}
</head>
<body>
${page.content}
</body>
</html>
`