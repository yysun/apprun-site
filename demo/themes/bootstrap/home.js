const Base = app.get_theme_view('base');

module.exports = page => {
  page.body = page.content;
  return Base(page);
}