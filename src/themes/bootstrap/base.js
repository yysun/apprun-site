const { site_name, extra_css, extra_javascript, extra_module } = app['config'];

module.exports = body => `
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>${site_name}</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
  <link href="https://unpkg.com/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://unpkg.com/jquery@3.4.1/dist/jquery.slim.min.js"></script>
  <script src="https://unpkg.com/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://unpkg.com/bootstrap@4.4.1/dist/js/bootstrap.min.js"></script>
  ${extra_css && extra_css.map(css => `<link rel="stylesheet" href="${css}">`).join('\n')}
  ${extra_javascript && extra_javascript.map(js => `<script src="${js}"></script>`).join('\n')}
</head>
<body>
${body}
${extra_module && extra_module.map(js => `<script src="${js}" type="module"></script>`).join('\n')}
</body>
</html>
`;