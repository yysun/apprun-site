
const { title, element, nav } = app['config'];

module.exports = (page_content) => `<div class="container">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="/">${title}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        ${nav?.map(item => `<li class="nav-item">
          <a class="nav-link" href=${item.link}>${item.text}</a>
        </li>`)?.join('')}
      </ul>
    </div>
  </nav>
  <div class="container" id=${element}>
  ${page_content}
  </div>
</div>`;