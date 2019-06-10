!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(o,s,function(t){return e[t]}.bind(null,s));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";(function(e){n.d(t,"a",function(){return A}),n.d(t,"b",function(){return r}),n.d(t,"c",function(){return b});class o{constructor(){this._events={}}on(e,t,n={}){this._events[e]=this._events[e]||[],this._events[e].push({fn:t,options:n})}off(e,t){let n=this._events[e];n&&((n=n.filter(e=>e.fn!==t)).length?this._events[e]=n:delete this._events[e])}run(e,...t){let n=this._events[e];return console.assert(!!n,"No subscriber for event: "+e),n&&((n=n.filter(n=>{const{fn:o,options:s}=n;return s.delay?this.delay(e,o,t,s):o.apply(this,t),!n.options.once})).length?this._events[e]=n:delete this._events[e]),n?n.length:0}once(e,t,n={}){this.on(e,t,Object.assign({},n,{once:!0}))}delay(e,t,n,o){o._t&&clearTimeout(o._t),o._t=setTimeout(()=>{clearTimeout(o._t),t.apply(this,n)},o.delay)}}let s;const i="object"==typeof self&&self.self===self&&self||"object"==typeof e&&e.global===e&&e;i.app&&i._AppRunVersions?s=i.app:(s=new o,i.app=s,i._AppRunVersions="AppRun-2");var r=s;let a=0;const c="_props";function p(e){const t=[],n=e=>{null!=e&&""!==e&&!1!==e&&t.push("function"==typeof e||"object"==typeof e?e:`${e}`)};return e&&e.forEach(e=>{Array.isArray(e)?e.forEach(e=>n(e)):n(e)}),t}const l={},u=function(e,t,n={}){null!=t&&(t=function e(t,n,o=0){if(0===o&&(a=0),"string"==typeof t)return t;if(Array.isArray(t))return t.map(t=>e(t,n,a++));let s=t;return t&&"function"==typeof t.tag&&Object.getPrototypeOf(t.tag).t&&(s=function(e,t,n){const{tag:o,props:s,children:i}=e;let a=s&&s.id,c=`_${n}_`;a?c=`_${a}_`:a=`_${n}_`,t.s||(t.s={});let p=t.s[c];p||(p=t.s[c]=new o(Object.assign({},s,{children:i})).mount(a)),p.mounted&&p.mounted(s,i);const l=p.state;let u="";return l instanceof Promise||!p.view||(u=p.view(l,s),p.rendered&&setTimeout(()=>p.rendered(l,s))),r.createElement("section",Object.assign({},s,{id:a}),u)}(t,n,a++)),s&&s.children&&(s.children=s.children.map(t=>e(t,n,a++))),s}(t,n),e&&(Array.isArray(t)?d(e,t):d(e,[t])))};function h(e,t){console.assert(!!e),function(e,t){const n=e.nodeName,o=`${t.tag||""}`;return n.toUpperCase()===o.toUpperCase()}(e,t)?(d(e,t.children),f(e,t.props)):e.parentNode.replaceChild(g(t),e)}function d(e,t){const n=Math.min(e.childNodes.length,t.length);for(let o=0;o<n;o++){const n=t[o],s=e.childNodes[o];if("string"==typeof n)s.textContent!==n&&(3===s.nodeType?s.textContent=n:e.replaceChild(m(n),s));else{const t=n.props&&n.props.key;if(t)if(s.key===t)h(e.childNodes[o],n);else{const i=l[t];i?(e.insertBefore(i,s),e.appendChild(s),h(e.childNodes[o],n)):e.insertBefore(g(n),s)}else h(e.childNodes[o],n)}}let o=e.childNodes.length;for(;o>n;)e.removeChild(e.lastChild),o--;if(t.length>n){const o=document.createDocumentFragment();for(let e=n;e<t.length;e++)o.appendChild(g(t[e]));e.appendChild(o)}}function m(e){if(0===e.indexOf("_html:")){const t=document.createElement("div");return t.insertAdjacentHTML("afterbegin",e.substring(6)),t}return document.createTextNode(e)}function g(e,t=!1){if(console.assert(null!=e),"string"==typeof e)return m(e);if(!e.tag||"function"==typeof e.tag)return m(JSON.stringify(e));const n=(t=t||"svg"===e.tag)?document.createElementNS("http://www.w3.org/2000/svg",e.tag):document.createElement(e.tag);return f(n,e.props),e.children&&e.children.forEach(e=>n.appendChild(g(e,t))),n}function f(e,t){console.assert(!!e),t=function(e,t){t.class=t.class||t.className,delete t.className;const n={};return e&&Object.keys(e).forEach(e=>n[e]=null),t&&Object.keys(t).forEach(e=>n[e]=t[e]),n}(e[c]||{},t||{}),e[c]=t;for(const n in t){const o=t[n];if("style"===n){e.style.cssText&&(e.style.cssText="");for(const t in o)e.style[t]!==o[t]&&(e.style[t]=o[t])}else if(n.startsWith("data-")){const t=n.substring(5).replace(/-(\w)/g,e=>e[1].toUpperCase());e.dataset[t]!==o&&(o||""===o?e.dataset[t]=o:delete e.dataset[t])}else"class"===n||n.startsWith("role")||n.indexOf("-")>0||e instanceof SVGElement||e.tagName.indexOf("-")>0?e.getAttribute(n)!==o&&(o?e.setAttribute(n,o):e.removeAttribute(n)):e[n]!==o&&(e[n]=o);"key"===n&&o&&(l[o]=e)}}const y={meta:new WeakMap,defineMetadata(e,t,n){this.meta.has(n)||this.meta.set(n,{}),this.meta.get(n)[e]=t},getMetadataKeys(e){return e=Object.getPrototypeOf(e),this.meta.get(e)?Object.keys(this.meta.get(e)):[]},getMetadata(e,t){return t=Object.getPrototypeOf(t),this.meta.get(t)?this.meta.get(t)[e]:null}};function b(e){return function(t){return app.webComponent(e,t),t}}const v=(e,t)=>t?e.state[t]:e.state,w=(e,t,n)=>{if(t){const o=Object.assign({},e.state);o[t]=n,e.setState(o)}else e.setState(n)};var _=(e,t,n,o)=>{if(e.startsWith("$on")){const n=t[e];if(e=e.substring(1),"boolean"==typeof n)t[e]=(t=>o.run(e,t));else if("string"==typeof n)t[e]=(e=>o.run(n,e));else if("function"==typeof n)t[e]=(e=>o.setState(n(o.state,e)));else if(Array.isArray(n)){const[s,...i]=n;"string"==typeof s?t[e]=(e=>o.run(s,...i,e)):"function"==typeof s&&(t[e]=(e=>o.setState(s(o.state,...i,e))))}}else if("$bind"===e){const s=t.type||"text",i="string"==typeof t[e]?t[e]:t.name;if("input"===n)switch(s){case"checkbox":t.checked=v(o,i),t.onclick=(e=>w(o,i||e.target.name,e.target.checked));break;case"radio":t.checked=v(o,i)===t.value,t.onclick=(e=>w(o,i||e.target.name,e.target.value));break;case"number":case"range":t.value=v(o,i),t.oninput=(e=>w(o,i||e.target.name,Number(e.target.value)));break;default:t.value=v(o,i),t.oninput=(e=>w(o,i||e.target.name,e.target.value))}else"select"===n?(t.selectedIndex=v(o,i),t.onchange=(e=>{e.target.multiple||w(o,i||e.target.name,e.target.selectedIndex)})):"option"===n&&(t.selected=v(o,i),t.onclick=(e=>w(o,i||e.target.name,e.target.selected)))}else app.run("$",{key:e,tag:n,props:t,component:o})};const x={};r.on("get-components",e=>e.components=x);const k=e=>e;class A{constructor(e,t,n,s){this.state=e,this.view=t,this.update=n,this.options=s,this._app=new o,this._actions=[],this._history=[],this._history_idx=-1,this.start=((e=null,t={render:!0})=>this.mount(e,Object.assign({},t,{render:!0})))}render(e,t){r.render(e,t,this)}renderState(e){if(!this.view)return;const t=r.createElement;r.createElement=((e,n,...o)=>(n&&Object.keys(n).forEach(t=>{t.startsWith("$")&&(_(t,n,e,this),delete n[t])}),t(e,n,...o)));const n=this.view(e);if(r.createElement=t,r.run("debug",{component:this,state:e,vdom:n||"[vdom is null - no render]"}),"object"!=typeof document)return;const o="string"==typeof this.element?document.getElementById(this.element):this.element;if(o){const e="_c";if(this.unload){if(o._component!==this&&(this.tracking_id=(new Date).valueOf().toString(),o.setAttribute(e,this.tracking_id),"undefined"!=typeof MutationObserver)){const t=new MutationObserver(e=>{const{removedNodes:n,oldValue:s}=e[0];(s===this.tracking_id||Array.from(n).indexOf(o)>=0)&&(this.unload(),t.disconnect())});o.parentNode&&t.observe(o.parentNode,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:[e]})}}else o.removeAttribute&&o.removeAttribute(e);o._component=this}this.render(o,n),this.rendered&&this.rendered(this.state)}setState(e,t={render:!0,history:!1}){if(e instanceof Promise)e.then(e=>{this.setState(e,t)}).catch(e=>{throw console.error(e),e}),this._state=e;else{if(this._state=e,null==e)return;this.state=e,!1!==t.render&&this.renderState(e),!1!==t.history&&this.enable_history&&(this._history=[...this._history,e],this._history_idx=this._history.length-1),"function"==typeof t.callback&&t.callback(this.state)}}mount(e=null,t){if(console.assert(!this.element,"Component already mounted."),this.options=t=Object.assign({},this.options,t),this.element=e,this.global_event=t.global_event,this.enable_history=!!t.history,this.enable_history){const e=()=>{this._history_idx--,this._history_idx>=0?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=0},n=()=>{this._history_idx++,this._history_idx<this._history.length?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=this._history.length-1};this.on(t.history.prev||"history-prev",e),this.on(t.history.next||"history-next",n)}return this.add_actions(),void 0===this.state&&(this.state=null!=this.model?this.model:{}),t.render?this.setState(this.state,{render:!0,history:!0}):this.setState(this.state,{render:!1,history:!0}),x[e]=x[e]||[],x[e].push(this),this}is_global_event(e){return e&&(e.startsWith("#")||e.startsWith("/"))}add_action(e,t,n={}){t&&"function"==typeof t&&this.on(e,(...o)=>{const s=t(this.state,...o);r.run("debug",{component:this,event:e,e:o,state:this.state,newState:s,options:n}),this.setState(s,n)},n)}add_actions(){const e=this.update||{};y.getMetadataKeys(this).forEach(t=>{if(t.startsWith("apprun-update:")){const n=y.getMetadata(t,this);e[n.name]=[this[n.key].bind(this),n.options]}});const t={};Array.isArray(e)?e.forEach(e=>{const[n,o,s]=e;n.toString().split(",").forEach(e=>t[e.trim()]=[o,s])}):Object.keys(e).forEach(n=>{const o=e[n];("function"==typeof o||Array.isArray(o))&&n.split(",").forEach(e=>t[e.trim()]=o)}),t["."]||(t["."]=k),Object.keys(t).forEach(e=>{const n=t[e];"function"==typeof n?this.add_action(e,n):Array.isArray(n)&&this.add_action(e,n[0],n[1])})}run(e,...t){const n=e.toString();return this.global_event||this.is_global_event(n)?r.run(n,...t):this._app.run(n,...t)}on(e,t,n){const o=e.toString();return this._actions.push({name:o,fn:t}),this.global_event||this.is_global_event(o)?r.on(o,t,n):this._app.on(o,t,n)}unmount(){this._actions.forEach(e=>{const{name:t,fn:n}=e;this.global_event||this.is_global_event(t)?r.off(t,n):this._app.off(t,n)})}}A.t=!0;const E=(e,t={})=>(class extends HTMLElement{constructor(){super()}get component(){return this._component}get state(){return this._component.state}static get observedAttributes(){return Object.assign({},t).observedAttributes}connectedCallback(){if(this.isConnected&&!this._component){const n=Object.assign({render:!0,shadow:!1},t);this._shadowRoot=n.shadow?this.attachShadow({mode:"open"}):this;const o={};Array.from(this.attributes).forEach(e=>o[e.name]=e.value),this.children&&(o.children=Array.from(this.children),o.children.forEach(e=>e.parentElement.removeChild(e))),this._component=new e(o).mount(this._shadowRoot,n),this.on=this._component.on.bind(this._component),this.run=this._component.run.bind(this._component)}}disconnectedCallback(){this._component.unmount(),this._component=null}attributeChangedCallback(...e){this._component&&this._component.run("attributeChanged",...e)}}),C=e=>{if(e||(e="#"),e.startsWith("#")){const[t,...n]=e.split("/");r.run(t,...n)||r.run("///",t,...n),r.run("//",t,...n)}else if(e.startsWith("/")){const[t,n,...o]=e.split("/");r.run("/"+n,...o)||r.run("///","/"+n,...o),r.run("//","/"+n,...o)}else r.run(e)||r.run("///",e),r.run("//",e)};r.createElement=function(e,t,...n){const o=p(n);return"string"==typeof e?{tag:e,props:t,children:o}:Array.isArray(e)?e:void 0===e&&n?o:Object.getPrototypeOf(e).t?{tag:e,props:t,children:o}:e(t,o)},r.render=function(e,t,n){u(e,t,n)},r.Fragment=function(e,...t){return p(t)},r.webComponent=((e,t,n)=>{"undefined"!=typeof customElements&&customElements.define(e,E(t,n))}),r.start=((e,t,n,o,s)=>{const i=Object.assign({},s,{render:!0,global_event:!0}),r=new A(t,n,o);return s&&s.rendered&&(r.rendered=s.rendered),r.mount(e,i),r});const j=e=>{};r.on("$",j),r.on("debug",e=>j),r.on("//",j),r.on("#",j),r.route=C,r.on("route",e=>r.route&&r.route(e)),"object"==typeof document&&document.addEventListener("DOMContentLoaded",()=>{r.route===C&&(window.onpopstate=(()=>C(location.hash)),C(location.hash))}),"object"==typeof window&&(window.Component=A,window.React=r),t.d=r}).call(this,n(2))},function(e,t,n){"use strict";n.r(t);var o=n(0);t.default={start:e=>{((e="#")=>{const t=(t,n)=>{n&&n.preventDefault(),t=(t=t.replace(/\/$/,""))||e,o.d.run(t)||o.d.run(`${e}_404`)};if(e.startsWith("#")&&o.d.on("///",()=>o.d.run(`${e}_404`)),e.startsWith("/")){document.addEventListener("DOMContentLoaded",()=>{window.onpopstate=(()=>t(location.pathname)),t(location.pathname)}),window.onclick=(t=>e(t));const e=e=>{const n=e.target;let o=n.href;o&&o.startsWith(document.location.origin)&&(e.preventDefault(),history.pushState(null,"",n.pathname),t(n.pathname))}}})(e.eventRoot),o.d.render(document.body,o.d.createElement(e.layout,Object.assign({},e)));const t=document.getElementById(e.element);e.pages.forEach(e=>{const[n,s]=e,i=(new s).mount(t);o.d.on(n,(...e)=>i.run(".",...e))})}}},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t);var o=n(1),s=n(0);let i=class extends s.a{constructor(){super(...arguments),this.view=(({src:e})=>s.b.createElement("img",{src:e}))}};i=function(e,t,n,o){var s,i=arguments.length,r=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(i<3?s(r):i>3?s(t,n,r):s(t,n))||r);return i>3&&r&&Object.defineProperty(t,n,r),r}([Object(s.c)("my-img")],i);let r=class extends s.a{constructor(){super(...arguments),this.state={},this.view=(e=>s.b.createElement(s.b.Fragment,null,s.b.createElement("div",null,s.b.createElement("button",{$onclick:"fetchComic"},"XKCD")),e.loading?s.b.createElement("div",null,"loading ... "):"",e.comic&&s.b.createElement(s.b.Fragment,null,s.b.createElement("h3",null,e.comic.title),s.b.createElement("img",{src:e.comic.url})))),this.update={loading:(e,t)=>Object.assign({},e,{loading:t}),fetchComic:async e=>{this.run("loading",!0);const t=await fetch("https://xkcd-imgs.herokuapp.com/"),n=await t.json();return this.run("loading",!1),{comic:n}}}}};r=function(e,t,n,o){var s,i=arguments.length,r=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(i<3?s(r):i>3?s(t,n,r):s(t,n))||r);return i>3&&r&&Object.defineProperty(t,n,r),r}([Object(s.c)("my-xkcd")],r);const a={title:"AppRun Site",element:"main",nav:[{text:"Home",link:"/"}],sidebar:[{link:"#",text:"Introduction"},{link:"#how-it-works",text:"How It Works"},{link:"#getting-started",text:"Getting Started"},{link:"#configuration",text:"Configuration"},{link:"#configuration_layout",text:"Switch Layout"},{link:"#configuration_diy",text:"Do It Yourself"},{link:"#components",text:"Components"},{link:"#web-components",text:"Web-components"},{link:"#fetch",text:"Async Fetch"},{link:"#pwa",text:"PWA"},{link:"#esm",text:"ES Modules *"},{link:"#deploy",text:"Deploy *"},{link:"#deploy_firebase",text:"Deploy/firebase *"},{link:"#deploy_github",text:"Deploy/github *"},{link:"#todo",text:"Todo *"},{link:"#references",text:"References *"},{link:"",text:"* working on docs"}],layout:({title:e,element:t,nav:n,sidebar:o})=>s.d.createElement(s.d.Fragment,null,s.d.createElement("nav",{class:"main-nav",markdown:"0"},s.d.createElement("a",{class:"nav-title",href:"/"},e),s.d.createElement("div",{class:"flex"}),n.map(e=>s.d.createElement("a",{class:"nav-item",href:e.link},e.text)),s.d.createElement("a",{class:"icon",href:"https://github.com/yysun/apprun-site",title:"GitHub"},s.d.createElement("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"currentcolor"},s.d.createElement("path",{d:"M12,2C6.48,2,2,6.59,2,12.25c0,4.53,2.87,8.37,6.84,9.73c0.5,0.09,0.68-0.22,0.68-0.49c0-0.24-0.01-0.89-0.01-1.74c-2.78,0.62-3.37-1.37-3.37-1.37c-0.45-1.18-1.11-1.5-1.11-1.5c-0.91-0.64,0.07-0.62,0.07-0.62c1,0.07,1.53,1.06,1.53,1.06c0.89,1.57,2.34,1.11,2.91,0.85c0.09-0.66,0.35-1.11,0.63-1.37c-2.22-0.26-4.56-1.14-4.56-5.07c0-1.12,0.39-2.03,1.03-2.75c-0.1-0.26-0.45-1.3,0.1-2.71c0,0,0.84-0.28,2.75,1.05c0.8-0.23,1.65-0.34,2.5-0.34c0.85,0,1.7,0.12,2.5,0.34c1.91-1.33,2.75-1.05,2.75-1.05c0.55,1.41,0.2,2.45,0.1,2.71c0.64,0.72,1.03,1.63,1.03,2.75c0,3.94-2.34,4.81-4.57,5.06c0.36,0.32,0.68,0.94,0.68,1.9c0,1.37-0.01,2.48-0.01,2.81c0,0.27,0.18,0.59,0.69,0.49c3.97-1.36,6.83-5.2,6.83-9.73C22,6.59,17.52,2,12,2"})))),s.d.createElement("main",{class:"wrapper"},s.d.createElement("nav",{class:"side-nav"},s.d.createElement("button",{id:"toggleNavButton"},"Menu"),s.d.createElement("ul",null,o.map(e=>s.d.createElement("li",null,s.d.createElement("a",{href:e.link},e.text))))),s.d.createElement("article",{id:t}))),pages:[["#_404",class extends s.a{constructor(){super(...arguments),this.state="404",this.view=(e=>s.b.createElement("div",null,e)),this.update=[[".",e=>e]]}}],["#components",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="components">Components</h1>\n<p>Components are the application building blocks in AppRun applications.</p>\n<p>An AppRun component  has the elm architecture, which means inside a component, there are <em>state</em>, <em>view</em>, and <em>update</em>. Basically, components provide a local scope.</p>\n<h2 id="create-component">Create Component</h2>\n<p>It is straightforward to create a component. You create a component class around the <em>state</em>, <em>view</em>, and <em>update</em>.</p>\n<pre><code class="language-javascript">import {app, Component} from \'apprun\';\n\nclass Counter extends Component {\n  state = \'\';\n  view = state =&gt; &lt;div/&gt;;\n  update = {};\n}\n</code></pre>\n<h2 id="mount-component-to-element">Mount Component to Element</h2>\n<p>Then you mount the component instance to an element.</p>\n<pre><code class="language-javascript">const element = \'main\';\nnew Counter().mount(element);\n</code></pre>\n<p>The component can be mounted to the web page element or element ID. When the component is mounted to an <em>element ID</em>, It will not render the element if it cannot find it.</p>\n<h2 id="child-components">Child Components</h2>\n<p>Beside mounting the components, you can also have nested components by using the capitalized JSX tag to create AppRun Components in JSX.</p>\n<pre><code class="language-javascript">class Child extends Component {\n  state = {}\n  view = state =&gt; &lt;div&gt;&lt;/div&gt;\n  update = {}\n}\n\nclass Parent extends Component {\n  state = {}\n  view = state =&gt; &lt;div&gt;\n    &lt;Child /&gt;\n  &lt;/div&gt;\n  update = {}\n}\n</code></pre>\n<p>Using components is a technique to decompose the large system into smaller, manageable, and reusable pieces.</p>\n<p>Components can be easily turned into <a href="#web-components">web components</a> and use in the HTML pages and markdown pages.</p>\n')}}],["#configuration_diy",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="do-it-youself">Do It Youself</h1>\n<p>Instead of following the out-of-box configuration schema, you can create the <strong>src/index.tsx</strong> of your own without using the <strong>app.start</strong> function.</p>\n<p>In this case, you will need to know how to create the layout, pages, and components, which is easy to do.</p>\n<h2 id="create-layout">Create Layout</h2>\n<p>You can create the layout as a regular <a href="#component">component</a> and render it before rendering pages. You can set up title, menus and nav whatever you want freely.</p>\n<h2 id="create-pages">Create Pages</h2>\n<p>The auto generated event-component mapping in <strong>src/_lib/index.tsx</strong> makes it very easy to create the pages, and sets the routing events to the pages in a generic way.</p>\n<pre><code class="language-javascript">import app from \'apprun\';\nimport Layout from \'./layout\';\nimport pages from \'./_lib\';\n\napp.render(document.body, &lt;Layout /&gt;);\n\nconst element = \'main\';\npages.forEach(def =&gt; {\n  const [e, Comp] = def;\n  const component = new Comp().mount(element);\n  app.on(e, (...p) =&gt; component.run(\'.\', ...p));\n});\n</code></pre>\n<blockquote>\n<p>Note: the . event is the <em>refresh</em> event built-in every AppRun component. It makes components render themselves.</p>\n</blockquote>\n<h2 id="create-components">Create Components</h2>\n<p>Components are the application building blocks in AppRun applications.</p>\n<p>Pages are <a href="#components">AppRun components</a> in the <strong>src/pages</strong> directory. They auto indexed and built into the application.</p>\n<p>Pages use components as building blocks. You can put non-page components in the <strong>src/components</strong> directory. And import them where needed.</p>\n<p>You can learn more about the components <a href="#components">here</a>.</p>\n')}}],["#configuration",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="configuration">Configuration</h1>\n<p>Apps built with AppRun Site are single page applications (SPA). SPA usually has a layout, which includes a header, a top nav, a sidebar, a footer, and the main area for displaying the pages.</p>\n<p>You can pass a configuration object to the <strong>app.start</strong> function to</p>\n<ul>\n<li>Set page title in the layout</li>\n<li>Set the main element Id for displaying the pages</li>\n<li>Set nav bar menus</li>\n<li>Set sidebar menus</li>\n<li>Set the layout component</li>\n<li>Set the pages, which is the auto-generated event-component mapping</li>\n</ul>\n<pre><code class="language-javascript">const config = {\n  title: \'My AppRun Site\',\n  element: \'main\',\n  nav,\n  sidebar: nav,\n  layout,\n  pages\n};\n\napp.start(site);\n</code></pre>\n<p>In the project created by using the <em>npx apprun-site init</em> command there are out-of-box four layouts included.</p>\n<ul>\n<li>Default</li>\n<li>Bootstrap</li>\n<li>CoreUI</li>\n<li>Material Design</li>\n</ul>\n<p>They all follow the configuration schema to render the page accordingly.</p>\n<p>You can learn how to <a href="#configuration_layout">use and switch layouts</a>.</p>\n<p>If you want to use your own layout, you can use the <a href="#configuration_diy">do it yourself</a> approach.</p>\n')}}],["#configuration_layout",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="layouts">Layouts</h1>\n<p>There are four layouts included.</p>\n<ul>\n<li>Default - best for documentation site</li>\n<li>Bootstrap - start point of bootstrap</li>\n<li>CoreUI - best for admin UI / business apps</li>\n<li>Material Design - best for mobile web app</li>\n</ul>\n<p>You can rename the layout folder to choose layout.</p>\n<h3 id="switch-layouts">Switch Layouts</h3>\n<p>You can rename the layout directory to switch the layouts.</p>\n<ul>\n<li>\n<p>To use the bootstrap layout, rename <em>layout-bootstrap</em> to <em>layout</em></p>\n</li>\n<li>\n<p>To use the coreUI layout, rename <em>layout-coreui</em> to <em>layout</em></p>\n</li>\n<li>\n<p>To use the material layout, rename <em>layout-material</em> to <em>layout</em></p>\n</li>\n</ul>\n<h2 id="don\'t-like-any-of-them%3F">Don\'t Like Any of Them?</h2>\n<p>Understand, you can <a href="#configuration_diy">do it yourself</a> easily.</p>\n')}}],["#configuration_nav",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="navigation">Navigation</h1>\n')}}],["#configuration_sidebar",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="sidebar">Sidebar</h1>\n')}}],["#deploy_firebase",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="firebase-hosting">Firebase Hosting</h1>\n')}}],["#deploy_github",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="github-pages">Github Pages</h1>\n')}}],["#deploy",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="deploy">Deploy</h1>\n<ul>\n<li>Use <em>npm run build</em> to build for production</li>\n</ul>\n')}}],["#esm",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="es-module">ES Module</h1>\n<p>By default, AppRun Site apps are transpiled and bundled. However, it is also ready to run using the ES Modules without bundle.</p>\n<h2 id="import-es-module-in-browser">Import ES Module in Browser</h2>\n<h2 id="dynamic-module-loading">Dynamic Module Loading</h2>\n')}}],["#faq",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="faq">FAQ</h1>\n')}}],["#fetch",class extends s.a{constructor(){super(...arguments),this.view=(e=>"_html:<h1 id=\"async-fetch\">Async Fetch</h1>\n<p>AppRun supports asynchronous operations in the AppRun event handlers. We only need to add the async keyword in front of the event handler. The event handler can call the functions that return a Promise object using the await keyword.</p>\n<p>See a component that displays random XKCD pictures using async fetch.</p>\n<p><my-xkcd></my-xkcd></p>\n<p>The code of the component is listed below.</p>\n<pre><code class=\"language-javascript\">import { app, Component, customElement } from 'apprun';\n\n@customElement('my-xkcd')\nexport default class extends Component {\n  state = {};\n\n  view = (state) =&gt; &lt;&gt;\n    &lt;div&gt;&lt;button $onclick='fetchComic'&gt;XKCD&lt;/button&gt;&lt;/div&gt;\n    {state.loading ? &lt;div&gt;loading ... &lt;/div&gt; : ''}\n    {state.comic &amp;&amp; &lt;&gt;\n      &lt;h3&gt;{state.comic.title}&lt;/h3&gt;\n      &lt;img src={state.comic.url} /&gt;\n    &lt;/&gt;}\n  &lt;/&gt;;\n\n  update = {\n    'loading': (state, loading) =&gt; ({ ...state, loading }),\n    'fetchComic': async _ =&gt; {\n      this.run('loading', true);\n      const response = await fetch('https://xkcd-imgs.herokuapp.com/');\n      const comic = await response.json();\n      this.run('loading', false);\n      return { comic };\n    }\n  };\n}\n</code></pre>\n<p>Using the async fetch, you can bring in data from other systems in to AppRun Site apps as easy as the example above.</p>\n<p>AppRun Site apps also have a service worker include to cache the fetch requests. The tool can be used to build a lightening fast app (even for dynamic content) that works offline.</p>\n<p>Learn how to make a <a href=\"#pwa\">Progress Web App</a>.</p>\n")}}],["#getting-started",class extends s.a{constructor(){super(...arguments),this.view=(e=>"_html:<h1 id=\"getting-start\">Getting Start</h1>\n<p>To create an AppRun Site:</p>\n<pre><code class=\"language-sh\">npx apprun-site init my-apprun-site\ncd my-apprun-site\nnpm install\n</code></pre>\n<p>The <strong>init</strong> command creates a project structure.</p>\n<pre><code>public/\nsrc/\n  layouts/\n  pages/\n    home.tsx\n    contact.tsx\n    about.tsx\n  index.tsx   &lt;=== main entry\n  tsconfig.json\n.gitignore\npackage.json\nwebpack.config.js\n</code></pre>\n<p>Use <em>npm start</em> to start the dev server and run the app in browser http://localhost:8080</p>\n<p>You can modify the home, contact and about components. Or add a few pages your own. The dev server will refresh to show your changes on the fly.</p>\n<p>The main entry point of the app is the <strong>src/index.tsx</strong>. It looks like:</p>\n<pre><code class=\"language-javascript\">import app from 'apprun-site';\nimport layout from './layout';\nimport pages from './_lib';\nconst nav = [\n  { &quot;text&quot;: &quot;Home&quot;, &quot;link&quot;: &quot;/&quot; },\n  { &quot;text&quot;: &quot;Contact&quot;, &quot;link&quot;: &quot;/contact&quot; },\n  { &quot;text&quot;: &quot;About&quot;, &quot;link&quot;: &quot;/about&quot; }\n];\n\nconst config = {\n  title: 'My AppRun Site',\n  element: 'main',\n  nav,\n  sidebar: nav,\n  layout,\n  pages\n};\n\napp.start(site);\n</code></pre>\n<p><strong>src/index.tsx</strong> imports the <em>app</em> object from <em>apprun.site</em> and calls the <em>app.start</em> function to start the app with the configuration options.</p>\n<p>Next, let's see how to <a href=\"#configuration\">configure</a>.</p>\n")}}],["#how-it-works",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="how-it-works">How It Works</h1>\n<p>You put your AppRun components in the <em>pages</em> directory structure as following:</p>\n<pre><code>src/\n  pages/\n    home.tsx\n    contact.tsx\n    about.tsx\n</code></pre>\n<p>You then run the <em>build</em> script.</p>\n<pre><code class="language-sh">npx apprun-site build\n</code></pre>\n<p>You can also run the <em>build</em> script in the watch mode.</p>\n<pre><code class="language-sh">npx apprun-site build -w\n</code></pre>\n<p>The <em>build</em> scripts creates the <strong>src/_lib/index.tsx</strong> file that contains the routing events and the components.</p>\n<pre><code class="language-javascript">// this file is auto-generated\nimport _about_0 from \'./about_tsx\';\nimport _contact_1 from \'./contact_tsx\';\nimport _home_2 from \'./home_tsx\';\nexport default [\n  [&quot;/about&quot;, _about_0],\n  [&quot;/contact&quot;, _contact_1],\n  [&quot;/home&quot;, _home_2],\n] as (readonly [string, any])[];\n</code></pre>\n<p>In addition to having AppRun components as pages, you can also add HTML files and markdown files in the <em>pages</em> directory. The <em>build</em> scripts converts them into AppRun components and saves to the <strong>src/_lib</strong> directory.</p>\n<p>The generated <strong>src/_lib/index.tsx</strong> imports the all components from <strong>src/_lib</strong> and <strong>src/pages</strong>; and exports an array that maps routing events to components.</p>\n<p>The main entry point of the application, <strong>src/index.tsx</strong>, imports the event-component mapping from <strong>src/_lib/index.tsx</strong>. Then it creates the pages, and sets the routing events.</p>\n<p>Next, let\'s <a href="#getting-started">Getting Started</a> to see it in action.</p>\n')}}],["#",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="apprun-site">AppRun Site</h1>\n<h2 id="introduction">Introduction</h2>\n<p><a href="https://apprun.js.org">AppRun</a> is a Javascript library for building reliable, high-performance web applications using the Elm inspired Architecture, events, and components.</p>\n<p><strong><a href="https://yysun.github.io/apprun-site">AppRun Site</a></strong> is a framework for building AppRun applications.</p>\n<h2 id="features">Features</h2>\n<ul>\n<li>Progressive Web App (PWA) - support offline</li>\n<li>Single Page App (SPA) - routing using / or #</li>\n<li>4 built-in layouts and bring your own</li>\n<li>Compile html, markdown pages to AppRun components</li>\n<li>Auto generate the index of pages</li>\n<li>Build app logic using AppRun/Web components</li>\n<li>Targets ES5 or ES Module</li>\n<li>Extensible through plugins (WIP)</li>\n</ul>\n<h2 id="quick-start">Quick Start</h2>\n<p>To create an AppRun Site:</p>\n<pre><code class="language-sh">npx apprun-site init my-apprun-site\ncd my-apprun-site\nnpm install\n</code></pre>\n<p>Then, you can use:</p>\n<ul>\n<li>Use <em>npm start</em> to start the dev server</li>\n<li>Use <em>npm run build</em> to build for production</li>\n</ul>\n<h2 id="ready-for-more-information">Ready for More Information</h2>\n<ul>\n<li>You can find out <a href="#how-it-works">how it works</a>.</li>\n</ul>\n')}}],["#pwa",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="progressive-web-apps-(pwa)">Progressive Web Apps (PWA)</h1>\n<p>AppRun Site includes the service worker from <a href="https://www.pwabuilder.com/">PWA Builder</a>.</p>\n<p>The service worker improves the performance of your app, and make it work offline. The advanced caching service worker allows you to configure files and routes that are cached in different manners (pre-cache, network/server first, cache first, etc.).</p>\n<h2 id="register-the-service-worker">Register the Service Worker</h2>\n<p>To register the service worker, include the script in the header section of the <strong>index.html</strong> file.</p>\n<pre><code>&lt;script src=&quot;sw-init.js&quot;&gt;&lt;/script&gt;\n</code></pre>\n<h2 id="configure-the-service-worker">Configure the Service Worker</h2>\n<p>To configure the service worker, open and edit the <strong>sw.js</strong> file.</p>\n<pre><code class="language-javascript">const CACHE = &quot;my-apprun-site&quot;;\nconst precacheFiles = [\n  &quot;index.html&quot;,\n  &quot;app.js&quot;,\n  &quot;style.css&quot;\n];\n\n// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = &quot;offline.html&quot;;\nconst offlineFallbackPage = &quot;offline.html&quot;;\n\nconst networkFirstPaths = [\n  /* Add an array of regex of paths that should go network first */\n  // Example: //api/.*/\n];\n\nconst avoidCachingPaths = [\n  /* Add an array of regex of paths that shouldn\'t be cached */\n  // Example: //api/.*/\n  //sockjs-node/*/\n];\n\n</code></pre>\n')}}],["#references",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="references">References</h1>\n<h2 id="init-command">Init Command</h2>\n<pre><code>Usage:\n  $ npx apprun-site init [targetDir]\n\nOptions:\n  -r, --repo [repo]  repository, default: apprunjs/apprun-starter\n  -h, --help         Display this message\n  -v, --version      Display version number\n</code></pre>\n<h2 id="build-command">Build Command</h2>\n<pre><code>Usage:\n  $ npx apprun-site build\n\nOptions:\n  -r, --root [root]         event root, default /, you can make it #\n  -s, --source [sourceDir]  source directory\n  -t, --target [targetDir]  target directory\n  -w, --watch               watch the folder\n  -V, --verbose             show verbose diagnostic information\n  -h, --help                Display this message\n  -v, --version             Display version number\n</code></pre>\n<h2 id="fix-esm-command">Fix ESM Command</h2>\n<pre><code>Usage:\n  $ npx apprun-site fix-esm\n\nOptions:\n  -m --modules &lt;modules&gt;    Choose a directory for global modules (default: _modules)\n  -V, --verbose             show verbose diagnostic information\n  -s, --source [sourceDir]  source directory\n  -h, --help                Display this message\n  -v, --version             Display version number\n</code></pre>\n')}}],["#routing",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="routing">Routing</h1>\n<h2 id="using-pretty-links-(%2F)">Using Pretty Links (/)</h2>\n<h2 id="using-hash-(%23)">Using Hash (#)</h2>\n')}}],["#todo",class extends s.a{constructor(){super(...arguments),this.view=(e=>'_html:<h1 id="todo">Todo</h1>\n<ul>\n<li>Plugin Support</li>\n<li>Site Search</li>\n<li>GraphQL</li>\n</ul>\n')}}],["#web-components_html",class extends s.a{constructor(){super(...arguments),this.view=(e=>"_html:<h1>Web Component - HTML</h1>\n<div>You can use web components in HTML</div>\n<pre>\n    &lt;my-img src='logo.png'&gt;&lt;/my-img&gt;\n</pre>\n<my-img src='logo.png'></my-img>")}}],["#web-components",class extends s.a{constructor(){super(...arguments),this.view=(e=>"_html:<h1 id=\"web-components\">Web Components</h1>\n<p>Web components are custom elements in HTML.</p>\n<pre><code>&lt;my-img src='logo.png'&gt;&lt;/my-img&gt;\n</code></pre>\n<p>You can create web components out of AppRun components.</p>\n<pre><code class=\"language-javascript\">import {app, Component, customElement} from 'apprun';\n\n@customElement('my-img')\nexport default class extends Component {\n  view = ({ src }) =&gt; &lt;img src={src} /&gt;\n}\n</code></pre>\n<p>And then use it in <a href=\"#web-components_html\">HTML page</a>, or in <a href=\"#web-components_tsx\">JSX view</a> of AppRun components, or in markdown page like in this page.</p>\n<p>This page is a markdown page. It should display the web component.</p>\n<p><my-img src='logo.png'></my-img></p>\n")}}],["#web-components_tsx",class extends s.a{constructor(){super(...arguments),this.view=(e=>s.b.createElement(s.b.Fragment,null,s.b.createElement("h1",null,"Web Component - tsx"),s.b.createElement("div",null,"You can use web components in the component's jsx view"),s.b.createElement("pre",null,"view = (state) => <my-img src='logo.png'></my-img>"),s.b.createElement("div",null,s.b.createElement("my-img",{src:"logo.png"}))))}}]]};o.default.start(a)}])});
//# sourceMappingURL=app.js.map