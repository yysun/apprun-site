!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var o in n)("object"==typeof exports?exports:t)[o]=n[o]}}(window,function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var s=e[o]={i:o,l:!1,exports:{}};return t[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(o,s,function(e){return t[e]}.bind(null,s));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=4)}([function(t,e,n){"use strict";(function(t){n.d(e,"a",function(){return E}),n.d(e,"b",function(){return r}),n.d(e,"c",function(){return b});class o{constructor(){this._events={}}on(t,e,n={}){this._events[t]=this._events[t]||[],this._events[t].push({fn:e,options:n})}off(t,e){let n=this._events[t];n&&((n=n.filter(t=>t.fn!==e)).length?this._events[t]=n:delete this._events[t])}run(t,...e){let n=this._events[t];return console.assert(!!n,"No subscriber for event: "+t),n&&((n=n.filter(n=>{const{fn:o,options:s}=n;return s.delay?this.delay(t,o,e,s):o.apply(this,e),!n.options.once})).length?this._events[t]=n:delete this._events[t]),n?n.length:0}once(t,e,n={}){this.on(t,e,Object.assign({},n,{once:!0}))}delay(t,e,n,o){o._t&&clearTimeout(o._t),o._t=setTimeout(()=>{clearTimeout(o._t),e.apply(this,n)},o.delay)}}let s;const i="object"==typeof self&&self.self===self&&self||"object"==typeof t&&t.global===t&&t;i.app&&i._AppRunVersions?s=i.app:(s=new o,i.app=s,i._AppRunVersions="AppRun-2");var r=s;let a=0;const c="_props";function l(t){const e=[],n=t=>{null!=t&&""!==t&&!1!==t&&e.push("function"==typeof t||"object"==typeof t?t:`${t}`)};return t&&t.forEach(t=>{Array.isArray(t)?t.forEach(t=>n(t)):n(t)}),e}const u={},p=function(t,e,n={}){null!=e&&(e=function t(e,n,o=0){if(0===o&&(a=0),"string"==typeof e)return e;if(Array.isArray(e))return e.map(e=>t(e,n,a++));let s=e;return e&&"function"==typeof e.tag&&Object.getPrototypeOf(e.tag).t&&(s=function(t,e,n){const{tag:o,props:s,children:i}=t;let a=s&&s.id,c=`_${n}_`;a?c=`_${a}_`:a=`_${n}_`,e.s||(e.s={});let l=e.s[c];l||(l=e.s[c]=new o(Object.assign({},s,{children:i})).mount(a)),l.mounted&&l.mounted(s,i);const u=l.state;let p="";return u instanceof Promise||!l.view||(p=l.view(u,s),l.rendered&&setTimeout(()=>l.rendered(u,s))),r.createElement("section",Object.assign({},s,{id:a}),p)}(e,n,a++)),s&&s.children&&(s.children=s.children.map(e=>t(e,n,a++))),s}(e,n),t&&(Array.isArray(e)?d(t,e):d(t,[e])))};function h(t,e){console.assert(!!t),function(t,e){const n=t.nodeName,o=`${e.tag||""}`;return n.toUpperCase()===o.toUpperCase()}(t,e)?(d(t,e.children),f(t,e.props)):t.parentNode.replaceChild(g(e),t)}function d(t,e){const n=Math.min(t.childNodes.length,e.length);for(let o=0;o<n;o++){const n=e[o],s=t.childNodes[o];if("string"==typeof n)s.textContent!==n&&(3===s.nodeType?s.textContent=n:t.replaceChild(m(n),s));else{const e=n.props&&n.props.key;if(e)if(s.key===e)h(t.childNodes[o],n);else{const i=u[e];i?(t.insertBefore(i,s),t.appendChild(s),h(t.childNodes[o],n)):t.insertBefore(g(n),s)}else h(t.childNodes[o],n)}}let o=t.childNodes.length;for(;o>n;)t.removeChild(t.lastChild),o--;if(e.length>n){const o=document.createDocumentFragment();for(let t=n;t<e.length;t++)o.appendChild(g(e[t]));t.appendChild(o)}}function m(t){if(0===t.indexOf("_html:")){const e=document.createElement("div");return e.insertAdjacentHTML("afterbegin",t.substring(6)),e}return document.createTextNode(t)}function g(t,e=!1){if(console.assert(null!=t),"string"==typeof t)return m(t);if(!t.tag||"function"==typeof t.tag)return m(JSON.stringify(t));const n=(e=e||"svg"===t.tag)?document.createElementNS("http://www.w3.org/2000/svg",t.tag):document.createElement(t.tag);return f(n,t.props),t.children&&t.children.forEach(t=>n.appendChild(g(t,e))),n}function f(t,e){console.assert(!!t),e=function(t,e){e.class=e.class||e.className,delete e.className;const n={};return t&&Object.keys(t).forEach(t=>n[t]=null),e&&Object.keys(e).forEach(t=>n[t]=e[t]),n}(t[c]||{},e||{}),t[c]=e;for(const n in e){const o=e[n];if("style"===n){t.style.cssText&&(t.style.cssText="");for(const e in o)t.style[e]!==o[e]&&(t.style[e]=o[e])}else if(n.startsWith("data-")){const e=n.substring(5).replace(/-(\w)/g,t=>t[1].toUpperCase());t.dataset[e]!==o&&(o||""===o?t.dataset[e]=o:delete t.dataset[e])}else"class"===n||n.startsWith("role")||n.indexOf("-")>0||t instanceof SVGElement||t.tagName.indexOf("-")>0?t.getAttribute(n)!==o&&(o?t.setAttribute(n,o):t.removeAttribute(n)):t[n]!==o&&(t[n]=o);"key"===n&&o&&(u[o]=t)}}const y={meta:new WeakMap,defineMetadata(t,e,n){this.meta.has(n)||this.meta.set(n,{}),this.meta.get(n)[t]=e},getMetadataKeys(t){return t=Object.getPrototypeOf(t),this.meta.get(t)?Object.keys(this.meta.get(t)):[]},getMetadata(t,e){return e=Object.getPrototypeOf(e),this.meta.get(e)?this.meta.get(e)[t]:null}};function b(t){return function(e){return app.webComponent(t,e),e}}const _=(t,e)=>e?t.state[e]:t.state,v=(t,e,n)=>{if(e){const o=Object.assign({},t.state);o[e]=n,t.setState(o)}else t.setState(n)};var w=(t,e,n,o)=>{if(t.startsWith("$on")){const n=e[t];if(t=t.substring(1),"boolean"==typeof n)e[t]=(e=>o.run(t,e));else if("string"==typeof n)e[t]=(t=>o.run(n,t));else if("function"==typeof n)e[t]=(t=>o.setState(n(o.state,t)));else if(Array.isArray(n)){const[s,...i]=n;"string"==typeof s?e[t]=(t=>o.run(s,...i,t)):"function"==typeof s&&(e[t]=(t=>o.setState(s(o.state,...i,t))))}}else if("$bind"===t){const s=e.type||"text",i="string"==typeof e[t]?e[t]:e.name;if("input"===n)switch(s){case"checkbox":e.checked=_(o,i),e.onclick=(t=>v(o,i||t.target.name,t.target.checked));break;case"radio":e.checked=_(o,i)===e.value,e.onclick=(t=>v(o,i||t.target.name,t.target.value));break;case"number":case"range":e.value=_(o,i),e.oninput=(t=>v(o,i||t.target.name,Number(t.target.value)));break;default:e.value=_(o,i),e.oninput=(t=>v(o,i||t.target.name,t.target.value))}else"select"===n?(e.selectedIndex=_(o,i),e.onchange=(t=>{t.target.multiple||v(o,i||t.target.name,t.target.selectedIndex)})):"option"===n&&(e.selected=_(o,i),e.onclick=(t=>v(o,i||t.target.name,t.target.selected)))}else app.run("$",{key:t,tag:n,props:e,component:o})};const x={};r.on("get-components",t=>t.components=x);const k=t=>t;class E{constructor(t,e,n,s){this.state=t,this.view=e,this.update=n,this.options=s,this._app=new o,this._actions=[],this._history=[],this._history_idx=-1,this.start=((t=null,e={render:!0})=>this.mount(t,Object.assign({},e,{render:!0})))}render(t,e){r.render(t,e,this)}renderState(t){if(!this.view)return;const e=r.createElement;r.createElement=((t,n,...o)=>(n&&Object.keys(n).forEach(e=>{e.startsWith("$")&&(w(e,n,t,this),delete n[e])}),e(t,n,...o)));const n=this.view(t);if(r.createElement=e,r.run("debug",{component:this,state:t,vdom:n||"[vdom is null - no render]"}),"object"!=typeof document)return;const o="string"==typeof this.element?document.getElementById(this.element):this.element;if(o){const t="_c";if(this.unload){if(o._component!==this&&(this.tracking_id=(new Date).valueOf().toString(),o.setAttribute(t,this.tracking_id),"undefined"!=typeof MutationObserver)){const e=new MutationObserver(t=>{const{removedNodes:n,oldValue:s}=t[0];(s===this.tracking_id||Array.from(n).indexOf(o)>=0)&&(this.unload(),e.disconnect())});o.parentNode&&e.observe(o.parentNode,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:[t]})}}else o.removeAttribute&&o.removeAttribute(t);o._component=this}this.render(o,n),this.rendered&&this.rendered(this.state)}setState(t,e={render:!0,history:!1}){if(t instanceof Promise)t.then(t=>{this.setState(t,e)}).catch(t=>{throw console.error(t),t}),this._state=t;else{if(this._state=t,null==t)return;this.state=t,!1!==e.render&&this.renderState(t),!1!==e.history&&this.enable_history&&(this._history=[...this._history,t],this._history_idx=this._history.length-1),"function"==typeof e.callback&&e.callback(this.state)}}mount(t=null,e){if(console.assert(!this.element,"Component already mounted."),this.options=e=Object.assign({},this.options,e),this.element=t,this.global_event=e.global_event,this.enable_history=!!e.history,this.enable_history){const t=()=>{this._history_idx--,this._history_idx>=0?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=0},n=()=>{this._history_idx++,this._history_idx<this._history.length?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=this._history.length-1};this.on(e.history.prev||"history-prev",t),this.on(e.history.next||"history-next",n)}return this.add_actions(),void 0===this.state&&(this.state=null!=this.model?this.model:{}),e.render?this.setState(this.state,{render:!0,history:!0}):this.setState(this.state,{render:!1,history:!0}),x[t]=x[t]||[],x[t].push(this),this}is_global_event(t){return t&&(t.startsWith("#")||t.startsWith("/"))}add_action(t,e,n={}){e&&"function"==typeof e&&this.on(t,(...o)=>{const s=e(this.state,...o);r.run("debug",{component:this,event:t,e:o,state:this.state,newState:s,options:n}),this.setState(s,n)},n)}add_actions(){const t=this.update||{};y.getMetadataKeys(this).forEach(e=>{if(e.startsWith("apprun-update:")){const n=y.getMetadata(e,this);t[n.name]=[this[n.key].bind(this),n.options]}});const e={};Array.isArray(t)?t.forEach(t=>{const[n,o,s]=t;n.toString().split(",").forEach(t=>e[t.trim()]=[o,s])}):Object.keys(t).forEach(n=>{const o=t[n];("function"==typeof o||Array.isArray(o))&&n.split(",").forEach(t=>e[t.trim()]=o)}),e["."]||(e["."]=k),Object.keys(e).forEach(t=>{const n=e[t];"function"==typeof n?this.add_action(t,n):Array.isArray(n)&&this.add_action(t,n[0],n[1])})}run(t,...e){const n=t.toString();return this.global_event||this.is_global_event(n)?r.run(n,...e):this._app.run(n,...e)}on(t,e,n){const o=t.toString();return this._actions.push({name:o,fn:e}),this.global_event||this.is_global_event(o)?r.on(o,e,n):this._app.on(o,e,n)}unmount(){this._actions.forEach(t=>{const{name:e,fn:n}=t;this.global_event||this.is_global_event(e)?r.off(e,n):this._app.off(e,n)})}}E.t=!0;const j=(t,e={})=>(class extends HTMLElement{constructor(){super()}get component(){return this._component}get state(){return this._component.state}static get observedAttributes(){return Object.assign({},e).observedAttributes}connectedCallback(){if(this.isConnected&&!this._component){const n=Object.assign({render:!0,shadow:!1},e);this._shadowRoot=n.shadow?this.attachShadow({mode:"open"}):this;const o={};Array.from(this.attributes).forEach(t=>o[t.name]=t.value),this.children&&(o.children=Array.from(this.children),o.children.forEach(t=>t.parentElement.removeChild(t))),this._component=new t(o).mount(this._shadowRoot,n),this.on=this._component.on.bind(this._component),this.run=this._component.run.bind(this._component)}}disconnectedCallback(){this._component.unmount(),this._component=null}attributeChangedCallback(...t){this._component&&this._component.run("attributeChanged",...t)}}),A=t=>{if(t||(t="#"),t.startsWith("#")){const[e,...n]=t.split("/");r.run(e,...n)||r.run("///",e,...n),r.run("//",e,...n)}else if(t.startsWith("/")){const[e,n,...o]=t.split("/");r.run("/"+n,...o)||r.run("///","/"+n,...o),r.run("//","/"+n,...o)}else r.run(t)||r.run("///",t),r.run("//",t)};r.createElement=function(t,e,...n){const o=l(n);return"string"==typeof t?{tag:t,props:e,children:o}:Array.isArray(t)?t:void 0===t&&n?o:Object.getPrototypeOf(t).t?{tag:t,props:e,children:o}:t(e,o)},r.render=function(t,e,n){p(t,e,n)},r.Fragment=function(t,...e){return l(e)},r.webComponent=((t,e,n)=>{"undefined"!=typeof customElements&&customElements.define(t,j(e,n))}),r.start=((t,e,n,o,s)=>{const i=Object.assign({},s,{render:!0,global_event:!0}),r=new E(e,n,o);return s&&s.rendered&&(r.rendered=s.rendered),r.mount(t,i),r});const C=t=>{};r.on("$",C),r.on("debug",t=>C),r.on("//",C),r.on("#",C),r.route=A,r.on("route",t=>r.route&&r.route(t)),"object"==typeof document&&document.addEventListener("DOMContentLoaded",()=>{r.route===A&&(window.onpopstate=(()=>A(location.hash)),A(location.hash))}),"object"==typeof window&&(window.Component=E,window.React=r),e.d=r}).call(this,n(3))},function(t,e,n){"use strict";n.r(e);var o=n(0);e.default={start:t=>{!function(t="#"){const e=(e,n)=>{n&&n.preventDefault(),e=(e=e.replace(/\/$/,""))||t,o.d.run(e)||o.d.run(`${t}_404`)};if(t.startsWith("/")){document.addEventListener("DOMContentLoaded",()=>{window.onpopstate=(()=>e(location.pathname)),e(location.pathname)}),window.onclick=(e=>t(e));const t=t=>{const n=t.target;let o=n.href;o&&o.startsWith(document.location.origin)&&(t.preventDefault(),history.pushState(null,"",n.pathname),e(n.pathname))}}}(t.eventRoot),o.d.render(document.body,o.d.createElement(t.layout,Object.assign({},t)));const e=document.getElementById(t.element);t.pages.forEach(t=>{const[n,s]=t,i=(new s).mount(e);o.d.on(n,(...t)=>i.run(".",...t))})}}},function(t){t.exports={c:"AppRun Site",a:"main",b:[{text:"Home",link:"/"}]}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";n.r(e);var o=n(1),s=n(0);let i=class extends s.a{constructor(){super(...arguments),this.view=(({src:t})=>s.b.createElement("img",{src:t}))}};i=function(t,e,n,o){var s,i=arguments.length,r=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(i<3?s(r):i>3?s(e,n,r):s(e,n))||r);return i>3&&r&&Object.defineProperty(e,n,r),r}([Object(s.c)("my-img")],i);var r=[["#apprun",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="apprun-site">AppRun Site</h1>\n<p>Source code: <a href="https://github.com/apprunjs/apprun-starter">AppRun Starter</a></p>\n')}}],["#configuration",class extends s.a{constructor(){super(...arguments),this.view=(t=>"_html:<h1 id=\"configuration\">Configuration</h1>\n<p>You can configue the site, in the src/index.tsx file.</p>\n<pre><code class=\"language-javascript\">import app from 'apprun-site';\nimport layout from './layout/index';\nimport pages from './_lib/index';\n\nimport './components/web-components/counter';\n\nconst nav = [\n  { &quot;text&quot;: &quot;Home&quot;, &quot;link&quot;: &quot;/&quot; },\n  { &quot;text&quot;: &quot;Contact&quot;, &quot;link&quot;: &quot;/contact&quot; },\n  { &quot;text&quot;: &quot;About&quot;, &quot;link&quot;: &quot;/about&quot; }\n];\n\nconst site = {\n  title: 'My AppRun Site',\n  element: 'main',\n  nav,\n  sidebar: nav,\n  layout,\n  pages,\n  eventRoot: '/'\n};\n\napp.start(site);\n</code></pre>\n")}}],["#configuration_layout",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="layouts">Layouts</h1>\n<h2 id="switch-layouts">Switch Layouts</h2>\n<p>There are four layouts included.</p>\n<ul>\n<li>Default</li>\n<li>Bootstrap</li>\n<li>CoreUI</li>\n<li>Material Design</li>\n</ul>\n<p><img src="https://github.com/apprunjs/apprun-starter/raw/master/p1.png" alt="">\n<img src="https://github.com/apprunjs/apprun-starter/raw/master/p2.png" alt="">\n<img src="https://github.com/apprunjs/apprun-starter/raw/master/p3.png" alt="">\n<img src="https://github.com/apprunjs/apprun-starter/raw/master/p4.png" alt=""></p>\n<p>You can rename the layout folder to choose layout.</p>\n<h3 id="to-use-the-bootstrap-layout">To use the bootstrap layout</h3>\n<ul>\n<li>rename <em>layout</em> to <em>layout-default</em></li>\n<li>copy <strong>index.html</strong> from <em>layout-bootstrap</em> to <em>public</em></li>\n<li>rename <em>layout-bootstrap</em> to <em>layout</em></li>\n</ul>\n<h3 id="to-use-the-coreui-layout">To use the coreUI layout</h3>\n<ul>\n<li>\n<p>rename <em>layout</em> to <em>layout-default</em></p>\n</li>\n<li>\n<p>copy <strong>index.html</strong> from <em>layout-coreui</em> to <em>public</em></p>\n</li>\n<li>\n<p>rename <em>layout-coreui</em> to <em>layout</em></p>\n</li>\n</ul>\n<h3 id="to-use-the-material-layout">To use the material layout</h3>\n<ul>\n<li>\n<p>rename <em>layout</em> to <em>layout-default</em></p>\n</li>\n<li>\n<p>copy <strong>index.html</strong> and <strong>style.css</strong> from <em>layout-material</em> to <em>public</em></p>\n</li>\n<li>\n<p>rename <em>layout-material</em> to <em>layout</em></p>\n</li>\n</ul>\n')}}],["#configuration_nav",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="navigation">Navigation</h1>\n')}}],["#configuration_sidebar",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="sidebar">Sidebar</h1>\n')}}],["#deploy_firebase",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="firebase-hosting">Firebase Hosting</h1>\n')}}],["#deploy_github",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="github-pages">Github Pages</h1>\n')}}],["#deploy",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="deploy">Deploy</h1>\n<ul>\n<li>Use <em>npm run build</em> to build for production</li>\n</ul>\n')}}],["#features",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="features">Features</h1>\n<ul>\n<li>Create Component Mapping</li>\n<li>Auto Register Components</li>\n<li>Compile HTML to Component</li>\n<li>Compile Markdown to Component</li>\n<li>Change Layouts</li>\n<li>Web Components Ready</li>\n</ul>\n<p>In addition to building the AppRun components, the <em>build</em> script also compiles the HTML files and markdown files into AppRun components.</p>\n')}}],["#getting-started",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="getting-start">Getting Start</h1>\n<p>To create an AppRun Site:</p>\n<pre><code class="language-sh">npx apprun-site init my-apprun-site\ncd my-apprun-site\nnpm install\n</code></pre>\n<p>The <strong>init</strong> command creates a project structure.</p>\n<pre><code>public/\nsrc/\n  layouts/\n  layouts-bootstrap/\n  layouts-coreui/\n  layouts-material/\n  pages/\n    home.tsx\n    contact.tsx\n    about.tsx\n  index.tsx\n  tsconfig.json\n.gitignore\npackage.json\nwebpack.config.js\n</code></pre>\n<p>Use <em>npm start</em> to start the dev server and run the app in browser http://localhost:8080</p>\n<p>You can modify the home, contact and about components. Or add a few your own. The dev server will refresh to show your changes on the fly.</p>\n<p>Next, you can start to <a href="#configuration">configure the site</a>.</p>\n')}}],["#how-it-works",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="how-it-works">How It Works</h1>\n<p>You put your code into the directory structure as following:</p>\n<pre><code>src/\n  pages/\n    home.tsx\n    contact.tsx\n    about.tsx\n</code></pre>\n<p>You then run the <em>build</em> script.</p>\n<pre><code class="language-sh">npx apprun-site build\n</code></pre>\n<p>You can also run the <em>build</em> script in the watch mode.</p>\n<pre><code class="language-sh">npx apprun-site build -w\n</code></pre>\n<p>The <em>build</em> scripts creates the <strong>src/_lib/index.tsx</strong> file that contains the routing events and the components.</p>\n<pre><code class="language-javascript">// this file is auto-generated\nimport _about_0 from \'./about_tsx\';\nimport _contact_1 from \'./contact_tsx\';\nimport _home_2 from \'./home_tsx\';\nexport default [\n  [&quot;/about&quot;, _about_0],\n  [&quot;/contact&quot;, _contact_1],\n  [&quot;/home&quot;, _home_2],\n] as (readonly [string, any])[];\n</code></pre>\n<p>AppRun Site includes the <em><strong>app.start</strong></em> function to import the generated list, create components, and map the routing events.</p>\n<p>Next, let\'s <a href="#getting-started">Getting Started</a>.</p>\n')}}],["#",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="apprun-site">AppRun Site</h1>\n<h2 id="introduction">Introduction</h2>\n<p><a href="https://apprun.js.org">AppRun</a> is a Javascript library for building reliable, high-performance web applications using the Elm inspired Architecture, events, and components.</p>\n<p><strong><a href="https://yysun.github.io/apprun-site">AppRun Site</a></strong> is a framework for building AppRun applications.</p>\n<h2 id="features">Features</h2>\n<ul>\n<li>Progressive Web App (PWA)</li>\n<li>Single Page App (SPA)</li>\n<li>Flexible layouts: 4 built-in and bring your own</li>\n<li>Routing based on directory</li>\n<li>Routing using / or #</li>\n<li>Compile html, markdown files to AppRun components</li>\n<li>Web components enabled: create and use</li>\n<li>Two targets: ES5 or ES Module</li>\n<li>Extensible through plugins (WIP)</li>\n</ul>\n<h2 id="quick-start">Quick Start</h2>\n<p>To create an AppRun Site:</p>\n<pre><code class="language-sh">npx apprun-site init my-apprun-site\ncd my-apprun-site\nnpm install\n</code></pre>\n<p>Then, you can use:</p>\n<ul>\n<li>Use <em>npm start</em> to start the dev server</li>\n<li>Use <em>npm run build</em> to build for production</li>\n</ul>\n<h2 id="ready-for-more-information">Ready for More Information</h2>\n<ul>\n<li>You can find out <a href="#how-it-works">how it works</a>.</li>\n</ul>\n')}}],["#todo",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="todo">Todo</h1>\n<ul>\n<li>a</li>\n<li>b</li>\n<li>c</li>\n</ul>\n')}}],["#web-components_html",class extends s.a{constructor(){super(...arguments),this.view=(t=>"_html:<h1>Web Component - HTML</h1>\n<div>You can use web components in HTML</div>\n<pre>\n    &lt;my-img src='/logo.png'&gt;&lt;/my-img&gt;\n</pre>\n<my-img src='/logo.png'></my-img>")}}],["#web-components",class extends s.a{constructor(){super(...arguments),this.view=(t=>'_html:<h1 id="web-components">Web Components</h1>\n<p>Web components are great building blocks for composing applications. Web components are custom elements.</p>\n<pre><code>&lt;my-img src=\'/logo.png\'&gt;&lt;/my-img&gt;\n</code></pre>\n<p>You can create web components out of AppRun components. Checkout the example of <strong><em>src/components/my-img.tsx</em></strong>.</p>\n<pre><code class="language-javascript">@customElement(\'my-img\')\nclass Img extends Component {\n  view = ({ src }) =&gt; &lt;img src={src} /&gt;\n}\n</code></pre>\n<p>And then use it in <a href="/web-components">HTML page</a>, or in <a href="/web-components/tsx">JSX view</a>, or in markdown page.</p>\n<p>This page is a markdown page. It should display the web component.</p>\n<p><my-img src=\'/logo.png\'></my-img></p>\n')}}],["#web-components_tsx",class extends s.a{constructor(){super(...arguments),this.view=(t=>s.b.createElement(s.b.Fragment,null,s.b.createElement("h1",null,"Web Component - tsx"),s.b.createElement("div",null,"You can use web components in the component's jsx view"),s.b.createElement("pre",null,"view = (state) => <my-img src='/logo.png'></my-img>"),s.b.createElement("div",null,s.b.createElement("my-img",{src:"/logo.png"}))))}}],["#_404",class extends s.a{constructor(){super(...arguments),this.state="404",this.view=(t=>s.b.createElement("div",null,t)),this.update=[[".",t=>t]]}}]],a=n(2);const c={title:a.c,element:a.a,nav:a.b,sidebar:[{link:"#",text:"Introduction"},{link:"#how-it-works",text:"How It Works"},{link:"#getting-started",text:"Getting Started"},{link:"#configuration",text:"Configuration *"},{link:"#configuration_layout",text:"Configuration/layout *"},{link:"#configuration_nav",text:"Configuration/nav *"},{link:"#configuration_sidebar",text:"Configuration/sidebar *"},{link:"#web-components",text:"Web-components"},{link:"#web-components_html",text:"Web-components/html"},{link:"#web-components_tsx",text:"Web-components/tsx"},{link:"#deploy",text:"Deploy *"},{link:"#deploy_firebase",text:"Deploy/firebase *"},{link:"#deploy_github",text:"Deploy/github *"},{link:"#todo",text:"Todo *"},{link:"",text:"* working on docs"}],layout:({title:t,element:e,nav:n,sidebar:o})=>s.d.createElement(s.d.Fragment,null,s.d.createElement("nav",{class:"main-nav",markdown:"0"},s.d.createElement("a",{class:"nav-title",href:"/"},t),s.d.createElement("div",{class:"flex"}),n.map(t=>s.d.createElement("a",{class:"nav-item",href:t.link},t.text)),s.d.createElement("a",{class:"icon",href:"https://github.com/yysun/apprun-site",title:"GitHub"},s.d.createElement("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"currentcolor"},s.d.createElement("path",{d:"M12,2C6.48,2,2,6.59,2,12.25c0,4.53,2.87,8.37,6.84,9.73c0.5,0.09,0.68-0.22,0.68-0.49c0-0.24-0.01-0.89-0.01-1.74c-2.78,0.62-3.37-1.37-3.37-1.37c-0.45-1.18-1.11-1.5-1.11-1.5c-0.91-0.64,0.07-0.62,0.07-0.62c1,0.07,1.53,1.06,1.53,1.06c0.89,1.57,2.34,1.11,2.91,0.85c0.09-0.66,0.35-1.11,0.63-1.37c-2.22-0.26-4.56-1.14-4.56-5.07c0-1.12,0.39-2.03,1.03-2.75c-0.1-0.26-0.45-1.3,0.1-2.71c0,0,0.84-0.28,2.75,1.05c0.8-0.23,1.65-0.34,2.5-0.34c0.85,0,1.7,0.12,2.5,0.34c1.91-1.33,2.75-1.05,2.75-1.05c0.55,1.41,0.2,2.45,0.1,2.71c0.64,0.72,1.03,1.63,1.03,2.75c0,3.94-2.34,4.81-4.57,5.06c0.36,0.32,0.68,0.94,0.68,1.9c0,1.37-0.01,2.48-0.01,2.81c0,0.27,0.18,0.59,0.69,0.49c3.97-1.36,6.83-5.2,6.83-9.73C22,6.59,17.52,2,12,2"})))),s.d.createElement("main",{class:"wrapper"},s.d.createElement("nav",{class:"side-nav"},s.d.createElement("button",{id:"toggleNavButton"},"Menu"),s.d.createElement("ul",null,o.map(t=>s.d.createElement("li",null,s.d.createElement("a",{href:t.link},t.text))))),s.d.createElement("article",{id:e}))),pages:r};o.default.start(c)}])});
//# sourceMappingURL=app.js.map