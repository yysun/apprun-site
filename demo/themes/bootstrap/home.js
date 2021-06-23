const index = require('./index').index;

const home = page => {
  page.content = `<body class="d-flex flex-column h-100">
<main class="flex-shrink-0">
  <div class="container">
  ${page.content}
  </div>
</main>
</body>`;
  return index(page);
};

module.exports = {
  default: page => home(page)
}
