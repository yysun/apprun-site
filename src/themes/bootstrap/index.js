const Base = require('./base');
module.exports = (page, view) => {

  switch (view) {
    case '':

    default:
      page.body = require('./layout')(page);
  }
  return Base(page);
}
