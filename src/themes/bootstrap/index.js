const Base = app.get_theme_view('base');

module.exports = page => {
  page.body = app.get_theme_view('./layout')(page);
  return Base(page);
}