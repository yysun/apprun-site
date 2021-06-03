
const { site_name, site_url, nav } = app['config'];

module.exports = (page) => `
  <header class="p-3 mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <span class="fs=4">${site_name}</span>
        </a>
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          ${!nav ? '' : nav.map(item => `<li class="nav-item">
            <a class="nav-link" href=${item.link}>${item.text}</a>
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </header>`;
