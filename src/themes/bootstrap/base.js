const { site_name } = app['config'];

module.exports = body => `
<html>
<head>
  <meta charset="utf-8"></meta>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
  <title>${site_name}</title>
  <link rel="manifest" href="/manifest.json"></link>
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"></link>
  <link href="https://unpkg.com/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
  <script src="https://unpkg.com/jquery@3.4.1/dist/jquery.slim.min.js"></script>
  <script src="https://unpkg.com/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://unpkg.com/bootstrap@4.4.1/dist/js/bootstrap.min.js"></script>
</head>
<body>
${body}
</body>
</html>
`;