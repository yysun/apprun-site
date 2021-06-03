const Base = app.get_theme_view('base');

module.exports = page => {
  page.body = `
  ${ app.get_theme_view('./layout')(page) }

  <div class="container-xxl my-md-4 bd-layout">

  ${ app.get_theme_view('./sidebar')(page) }

  <main class="bd-main order-1">
      <div class="container">
      ${page.content}
      </div>
    </main>
  </div>

`
  return Base(page);
}
