const Base = require('./base');
const Layout = require('./layout');

module.exports = (page_content) => Base(Layout(page_content));
