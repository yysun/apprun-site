import app from 'apprun';
import Layout from '../src/tailwind/layout';

const add_css = url => {
  const link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  document.head.appendChild(link);
};

const add_js = (url, type = null) =>  {
  const link = document.createElement('script') as HTMLScriptElement;
  link.src = url;
  (type) ? link.type = type : null;
  document.body.appendChild(link);
};

const render_layout = ({ Layout, styles = null, scripts = null, body_class = null }) => {
  if (document.head.getAttribute('has_css')) return;
  document.head.setAttribute('has_css', 'true');
  if (styles) {
    for (let i = 0; i < styles.length; i++) add_css(styles[i]);
  }
  if (scripts) {
    for (let i = 0; i < scripts.length; i++) add_js(scripts[i]);
  }

  body_class && document.body.classList.add(...body_class);
  Layout && app.render(document.body, <Layout />);
}

export default () => {
  window["app-element"] = 'my-app';
  render_layout(Layout);
}
