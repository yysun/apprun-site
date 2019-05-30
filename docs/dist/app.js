!function(t){var e={};function n(s){if(e[s])return e[s].exports;var o=e[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(s,o,function(e){return t[e]}.bind(null,o));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=4)}([function(t,e,n){"use strict";(function(t){n.d(e,"a",function(){return k}),n.d(e,"b",function(){return i});class s{constructor(){this._events={}}on(t,e,n={}){this._events[t]=this._events[t]||[],this._events[t].push({fn:e,options:n})}off(t,e){let n=this._events[t];n&&((n=n.filter(t=>t.fn!==e)).length?this._events[t]=n:delete this._events[t])}run(t,...e){let n=this._events[t];return console.assert(!!n,"No subscriber for event: "+t),n&&((n=n.filter(n=>{const{fn:s,options:o}=n;return o.delay?this.delay(t,s,e,o):s.apply(this,e),!n.options.once})).length?this._events[t]=n:delete this._events[t]),n?n.length:0}once(t,e,n={}){this.on(t,e,Object.assign({},n,{once:!0}))}delay(t,e,n,s){s._t&&clearTimeout(s._t),s._t=setTimeout(()=>{clearTimeout(s._t),e.apply(this,n)},s.delay)}}let o;const r="object"==typeof self&&self.self===self&&self||"object"==typeof t&&t.global===t&&t;r.app&&r._AppRunVersions?o=r.app:(o=new s,r.app=o,r._AppRunVersions="AppRun-2");var i=o;let a=0;const c="_props";function l(t){const e=[],n=t=>{null!=t&&""!==t&&!1!==t&&e.push("function"==typeof t||"object"==typeof t?t:`${t}`)};return t&&t.forEach(t=>{Array.isArray(t)?t.forEach(t=>n(t)):n(t)}),e}const p={},h=function(t,e,n={}){null!=e&&(e=function t(e,n,s=0){if(0===s&&(a=0),"string"==typeof e)return e;if(Array.isArray(e))return e.map(e=>t(e,n,a++));let o=e;return e&&"function"==typeof e.tag&&Object.getPrototypeOf(e.tag).t&&(o=function(t,e,n){const{tag:s,props:o,children:r}=t;let a=o&&o.id,c=`_${n}_`;a?c=`_${a}_`:a=`_${n}_`,e.s||(e.s={});let l=e.s[c];l||(l=e.s[c]=new s(Object.assign({},o,{children:r})).mount(a)),l.mounted&&l.mounted(o,r);const p=l.state;let h="";return p instanceof Promise||!l.view||(h=l.view(p,o),l.rendered&&setTimeout(()=>l.rendered(p,o))),i.createElement("section",Object.assign({},o,{id:a}),h)}(e,n,a++)),o&&o.children&&(o.children=o.children.map(e=>t(e,n,a++))),o}(e,n),t&&(Array.isArray(e)?u(t,e):u(t,[e])))};function d(t,e){console.assert(!!t),function(t,e){const n=t.nodeName,s=`${e.tag||""}`;return n.toUpperCase()===s.toUpperCase()}(t,e)?(u(t,e.children),f(t,e.props)):t.parentNode.replaceChild(m(e),t)}function u(t,e){const n=Math.min(t.childNodes.length,e.length);for(let s=0;s<n;s++){const n=e[s],o=t.childNodes[s];if("string"==typeof n)o.textContent!==n&&(3===o.nodeType?o.textContent=n:t.replaceChild(g(n),o));else{const e=n.props&&n.props.key;if(e)if(o.key===e)d(t.childNodes[s],n);else{const r=p[e];r?(t.insertBefore(r,o),t.appendChild(o),d(t.childNodes[s],n)):t.insertBefore(m(n),o)}else d(t.childNodes[s],n)}}let s=t.childNodes.length;for(;s>n;)t.removeChild(t.lastChild),s--;if(e.length>n){const s=document.createDocumentFragment();for(let t=n;t<e.length;t++)s.appendChild(m(e[t]));t.appendChild(s)}}function g(t){if(0===t.indexOf("_html:")){const e=document.createElement("div");return e.insertAdjacentHTML("afterbegin",t.substring(6)),e}return document.createTextNode(t)}function m(t,e=!1){if(console.assert(null!=t),"string"==typeof t)return g(t);if(!t.tag||"function"==typeof t.tag)return g(JSON.stringify(t));const n=(e=e||"svg"===t.tag)?document.createElementNS("http://www.w3.org/2000/svg",t.tag):document.createElement(t.tag);return f(n,t.props),t.children&&t.children.forEach(t=>n.appendChild(m(t,e))),n}function f(t,e){console.assert(!!t),e=function(t,e){e.class=e.class||e.className,delete e.className;const n={};return t&&Object.keys(t).forEach(t=>n[t]=null),e&&Object.keys(e).forEach(t=>n[t]=e[t]),n}(t[c]||{},e||{}),t[c]=e;for(const n in e){const s=e[n];if("style"===n){t.style.cssText&&(t.style.cssText="");for(const e in s)t.style[e]!==s[e]&&(t.style[e]=s[e])}else if(n.startsWith("data-")){const e=n.substring(5).replace(/-(\w)/g,t=>t[1].toUpperCase());t.dataset[e]!==s&&(s||""===s?t.dataset[e]=s:delete t.dataset[e])}else"class"===n||n.startsWith("role")||n.indexOf("-")>0||t instanceof SVGElement||t.tagName.indexOf("-")>0?t.getAttribute(n)!==s&&(s?t.setAttribute(n,s):t.removeAttribute(n)):t[n]!==s&&(t[n]=s);"key"===n&&s&&(p[s]=t)}}const y={meta:new WeakMap,defineMetadata(t,e,n){this.meta.has(n)||this.meta.set(n,{}),this.meta.get(n)[t]=e},getMetadataKeys(t){return t=Object.getPrototypeOf(t),this.meta.get(t)?Object.keys(this.meta.get(t)):[]},getMetadata(t,e){return e=Object.getPrototypeOf(e),this.meta.get(e)?this.meta.get(e)[t]:null}};const b=(t,e)=>e?t.state[e]:t.state,v=(t,e,n)=>{if(e){const s=Object.assign({},t.state);s[e]=n,t.setState(s)}else t.setState(n)};var w=(t,e,n,s)=>{if(t.startsWith("$on")){const n=e[t];if(t=t.substring(1),"boolean"==typeof n)e[t]=(e=>s.run(t,e));else if("string"==typeof n)e[t]=(t=>s.run(n,t));else if("function"==typeof n)e[t]=(t=>s.setState(n(s.state,t)));else if(Array.isArray(n)){const[o,...r]=n;e[t]=(t=>s.setState(o(s.state,...r,t)))}}else if("$bind"===t){const o=e.type||"text",r="string"==typeof e[t]?e[t]:e.name;if("input"===n)switch(o){case"checkbox":e.checked=b(s,r),e.onclick=(t=>v(s,r||t.target.name,t.target.checked));break;case"radio":e.checked=b(s,r)===e.value,e.onclick=(t=>v(s,r||t.target.name,t.target.value));break;case"number":case"range":e.value=b(s,r),e.oninput=(t=>v(s,r||t.target.name,Number(t.target.value)));break;default:e.value=b(s,r),e.oninput=(t=>v(s,r||t.target.name,t.target.value))}else"select"===n?(e.selectedIndex=b(s,r),e.onchange=(t=>{t.target.multiple||v(s,r||t.target.name,t.target.selectedIndex)})):"option"===n&&(e.selected=b(s,r),e.onclick=(t=>v(s,r||t.target.name,t.target.selected)))}else app.run("$",{key:t,tag:n,props:e,component:s})};const _={};i.on("get-components",t=>t.components=_);const x=t=>t;class k{constructor(t,e,n,o){this.state=t,this.view=e,this.update=n,this.options=o,this._app=new s,this._actions=[],this._history=[],this._history_idx=-1,this.start=((t=null,e={render:!0})=>this.mount(t,Object.assign({},e,{render:!0})))}renderState(t){if(!this.view)return;const e=i.createElement;i.createElement=((t,n,...s)=>(n&&Object.keys(n).forEach(e=>{e.startsWith("$")&&(w(e,n,t,this),delete n[e])}),e(t,n,...s)));const n=this.view(t);if(i.createElement=e,i.run("debug",{component:this,state:t,vdom:n||"[vdom is null - no render]"}),"object"!=typeof document)return;const s="string"==typeof this.element?document.getElementById(this.element):this.element;if(s){const t="_c";if(this.unload){if(s._component!==this){this.tracking_id=(new Date).valueOf().toString(),s.setAttribute(t,this.tracking_id);const e=new MutationObserver(t=>{const{removedNodes:n,oldValue:o}=t[0];(o===this.tracking_id||Array.from(n).indexOf(s)>=0)&&(this.unload(),e.disconnect())});s.parentNode&&e.observe(s.parentNode,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:[t]})}}else s.removeAttribute&&s.removeAttribute(t);s._component=this}i.render(s,n,this),this.rendered&&this.rendered(this.state)}setState(t,e={render:!0,history:!1}){if(t instanceof Promise)t.then(t=>{this.setState(t,e)}).catch(t=>{throw console.error(t),t}),this._state=t;else{if(this._state=t,null==t)return;this.state=t,!1!==e.render&&this.renderState(t),!1!==e.history&&this.enable_history&&(this._history=[...this._history,t],this._history_idx=this._history.length-1),"function"==typeof e.callback&&e.callback(this.state)}}mount(t=null,e){if(console.assert(!this.element,"Component already mounted."),this.options=e=Object.assign({},this.options,e),this.element=t,this.global_event=e.global_event,this.enable_history=!!e.history,this.enable_history){const t=()=>{this._history_idx--,this._history_idx>=0?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=0},n=()=>{this._history_idx++,this._history_idx<this._history.length?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=this._history.length-1};this.on(e.history.prev||"history-prev",t),this.on(e.history.next||"history-next",n)}return this.add_actions(),void 0===this.state&&(this.state=null!=this.model?this.model:{}),e.render?this.setState(this.state,{render:!0,history:!0}):this.setState(this.state,{render:!1,history:!0}),_[t]=_[t]||[],_[t].push(this),this}is_global_event(t){return t&&(t.startsWith("#")||t.startsWith("/"))}add_action(t,e,n={}){e&&"function"==typeof e&&this.on(t,(...s)=>{const o=e(this.state,...s);i.run("debug",{component:this,event:t,e:s,state:this.state,newState:o,options:n}),this.setState(o,n)},n)}add_actions(){const t=this.update||{};y.getMetadataKeys(this).forEach(e=>{if(e.startsWith("apprun-update:")){const n=y.getMetadata(e,this);t[n.name]=[this[n.key].bind(this),n.options]}});const e={};Array.isArray(t)?t.forEach(t=>{const[n,s,o]=t;n.toString().split(",").forEach(t=>e[t.trim()]=[s,o])}):Object.keys(t).forEach(n=>{const s=t[n];("function"==typeof s||Array.isArray(s))&&n.split(",").forEach(t=>e[t.trim()]=s)}),e["."]||(e["."]=x),Object.keys(e).forEach(t=>{const n=e[t];"function"==typeof n?this.add_action(t,n):Array.isArray(n)&&this.add_action(t,n[0],n[1])})}run(t,...e){const n=t.toString();return this.global_event||this.is_global_event(n)?i.run(n,...e):this._app.run(n,...e)}on(t,e,n){const s=t.toString();return this._actions.push({name:s,fn:e}),this.global_event||this.is_global_event(s)?i.on(s,e,n):this._app.on(s,e,n)}unmount(){this._actions.forEach(t=>{const{name:e,fn:n}=t;this.global_event||this.is_global_event(e)?i.off(e,n):this._app.off(e,n)})}}k.t=!0;const E=(t,e={})=>(class extends HTMLElement{constructor(){super()}get component(){return this._component}get state(){return this._component.state}connectedCallback(){if(this.isConnected&&!this._component){const n=Object.assign({render:!0,shadow:!1},e);this._shadowRoot=n.shadow?this.attachShadow({mode:"open"}):this;const s={};Array.from(this.attributes).forEach(t=>s[t.name]=t.value),this.children&&(s.children=Array.from(this.children),s.children.forEach(t=>t.parentElement.removeChild(t))),this._component=new t(s).mount(this._shadowRoot,n),this.on=this._component.on.bind(this._component),this.run=this._component.run.bind(this._component)}}disconnectedCallback(){this._component.unmount(),this._component=null}}),A=t=>{if(t||(t="#"),t.startsWith("#")){const[e,...n]=t.split("/");i.run(e,...n)||i.run("///",e,...n),i.run("//",e,...n)}else if(t.startsWith("/")){const[e,n,...s]=t.split("/");i.run("/"+n,...s)||i.run("///","/"+n,...s),i.run("//","/"+n,...s)}else i.run(t)||i.run("///",t),i.run("//",t)};i.createElement=function(t,e,...n){const s=l(n);return"string"==typeof t?{tag:t,props:e,children:s}:Array.isArray(t)?t:void 0===t&&n?s:Object.getPrototypeOf(t).t?{tag:t,props:e,children:s}:t(e,s)},i.render=function(t,e,n){h(t,e,n)},i.Fragment=function(t,...e){return l(e)},i.webComponent=((t,e,n)=>{customElements&&customElements.define(t,E(e,n))}),i.start=((t,e,n,s,o)=>{const r=Object.assign({},o,{render:!0,global_event:!0}),i=new k(e,n,s);return o&&o.rendered&&(i.rendered=o.rendered),i.mount(t,r),i});const C=t=>{};i.on("$",C),i.on("debug",t=>C),i.on("//",C),i.on("#",C),i.route=A,i.on("route",t=>i.route&&i.route(t)),"object"==typeof document&&document.addEventListener("DOMContentLoaded",()=>{i.route===A&&(window.onpopstate=(()=>A(location.hash)),A(location.hash))}),"object"==typeof window&&(window.Component=k,window.React=i),e.c=i}).call(this,n(3))},function(t,e,n){"use strict";n.r(e),n.d(e,"Link",function(){return a});var s=n(0);const o=(t,e)=>{e&&e.preventDefault(),t=(t=t.replace(/\/$/,""))||"/",s.c.run(t)||s.c.run("/_404")};document.addEventListener("DOMContentLoaded",()=>{window.onpopstate=(()=>o(location.pathname)),o(location.pathname)}),window.onclick=(t=>r(t));const r=t=>{const e=t.target;let n=e.href;n&&n.startsWith(document.location.origin)&&(t.preventDefault(),n.endsWith("/")||(n+="/"),history.pushState(null,"",e.pathname),o(e.pathname))},i=({element:t,url:e})=>{t.innerHTML="<div></div>",fetch("/pages/"+e).then(t=>t.text()).then(e=>t.innerHTML=e)},a=({to:t,className:e},n)=>s.c.createElement("a",{class:e,href:"{to}",onclick:e=>o(t,e)},n);e.default={start:t=>{s.c.render(document.body,s.c.createElement(t.layout,Object.assign({},t)));const e=document.getElementById(t.element);t.pages.forEach(t=>{const[n,o]=t;if("string"==typeof o)s.c.on(n,()=>s.c.render(e,s.c.createElement(i,{element:e,url:o})));else{const t=(new o).mount(e);s.c.on(n,(...e)=>t.run(".",...e))}})}}},function(t){t.exports={c:"My App",a:"main",b:[{text:"Home",link:"/"}]}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";n.r(e);var s=n(1),o=n(0);o.b.webComponent("my-img",class extends o.a{constructor(){super(...arguments),this.view=(({src:t})=>o.b.createElement("img",{src:t}))}});var r=[["/_404",class extends o.a{constructor(){super(...arguments),this.state="404",this.view=(t=>o.b.createElement("div",null,t)),this.update=[[".",t=>t]]}}],["/apprun-site",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"apprun-site"},children:["AppRun Site"]},"\n",{tag:"p",props:{},children:["Source code: ",{tag:"a",props:{href:"https://github.com/apprunjs/apprun-starter"},children:["AppRun Starter"]}]},"\n"])}}],["/configuration",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"configuration"},children:["Configuration"]},"\n"])}}],["/configuration/layout",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"layout"},children:["Layout"]},"\n"])}}],["/configuration/nav",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"navigation"},children:["Navigation"]},"\n"])}}],["/configuration/sidebar",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"sidebar"},children:["Sidebar"]},"\n"])}}],["/configuration/theme",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"theme"},children:["Theme"]},"\n"])}}],["/deploy/firebase",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"firebase-hosting"},children:["Firebase Hosting"]},"\n"])}}],["/deploy/github",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"github-pages"},children:["Github Pages"]},"\n"])}}],["/deploy",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"deploy"},children:["Deploy"]},"\n"])}}],["/features",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"features"},children:["Features"]},"\n",{tag:"ul",props:{},children:["\n",{tag:"li",props:{},children:["Create Component Mapping"]},"\n",{tag:"li",props:{},children:["Auto Register Components"]},"\n",{tag:"li",props:{},children:["Compile HTML to Component"]},"\n",{tag:"li",props:{},children:["Compile Markdown to Component"]},"\n",{tag:"li",props:{},children:["Change Layouts"]},"\n",{tag:"li",props:{},children:["Web Components Ready"]},"\n"]},"\n"])}}],["/how-it-works",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"how-it-works"},children:["How It Works"]},"\n",{tag:"p",props:{},children:["AppRun Site lets you organize a into well-planned directory structure as following:"]},"\n",{tag:"pre",props:{},children:[{tag:"code",props:{},children:["public/\nsrc/\n  layout/\n  pages/\n    home/\n    contact/\n    about/\n  config.json\n  index.ts\n"]}]},"\n"])}}],["/",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"apprun-site-cli"},children:["AppRun Site CLI"]},"\n",{tag:"p",props:{},children:[{tag:"img",props:{src:"logo.png",alt:"logo"},children:[]}]},"\n",{tag:"h2",props:{id:"introduction"},children:["Introduction"]},"\n",{tag:"p",props:{},children:[{tag:"a",props:{href:"https://apprun.js.org"},children:["AppRun"]}," is a Javascript library for building reliable, high-performance web applications using the Elm inspired Architecture, events, and components."]},"\n",{tag:"p",props:{},children:[{tag:"strong",props:{},children:["AppRun Site CLI"]}," is a tool to create an ",{tag:"a",props:{href:"apprun-site"},children:["AppRun Site"]},", an application framework for AppRun, which has structure that has the following structure:"]},"\n",{tag:"pre",props:{},children:[{tag:"code",props:{},children:["public/\nsrc/\n  components/\n  layout/\n    Layout.tsx\n    index.html\n    style.css\n  pages/\n    _lib\n      index.ts\n    home/\n    contact/\n    about/\n  config.json\n  index.ts\n"]}]},"\n",{tag:"h2",props:{id:"quick-start"},children:["Quick Start"]},"\n",{tag:"p",props:{},children:["To create an AppRun Site:"]},"\n",{tag:"pre",props:{},children:[{tag:"code",props:{class:"language-sh"},children:["npx apprun-site init my-apprun-site\ncd my-apprun-site\nnpm install\n"]}]},"\n",{tag:"p",props:{},children:["Then, you can use:"]},"\n",{tag:"ul",props:{},children:["\n",{tag:"li",props:{},children:["Use ",{tag:"em",props:{},children:["npm start"]}," to start the dev server"]},"\n",{tag:"li",props:{},children:["Use ",{tag:"em",props:{},children:["npm run build"]}," to build for production"]},"\n"]},"\n",{tag:"h2",props:{id:"ready-for-more-information"},children:["Ready for More Information"]},"\n",{tag:"ul",props:{},children:["\n",{tag:"li",props:{},children:["You can find out AppRun Site ",{tag:"a",props:{href:"/features"},children:["features"]}," of  and  ",{tag:"a",props:{href:"/how-it-works"},children:["how it works"]},"."]},"\n"]},"\n"])}}],["/todo",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"todo"},children:["Todo"]},"\n",{tag:"ul",props:{},children:["\n",{tag:"li",props:{},children:["a"]},"\n",{tag:"li",props:{},children:["b"]},"\n",{tag:"li",props:{},children:["c"]},"\n"]},"\n"])}}],["/web-components",class extends o.a{constructor(){super(...arguments),this.view=(t=>"_html:<h1>Web Component - HTML</h1>\n<div>web components defined in HTML</div>\n<my-img src='/logo.png'></my-img>")}}],["/web-components/md",class extends o.a{constructor(){super(...arguments),this.view=(t=>[{tag:"h1",props:{id:"web-component---markdown"},children:["Web Component - Markdown"]},"\n",{tag:"p",props:{},children:["<div>web components defined in Markdown</div>","\n","<my-img src='/logo.png'></my-img>"]},"\n",{tag:"ul",props:{},children:["\n",{tag:"li",props:{},children:["Try it in ",{tag:"a",props:{href:"/web-components"},children:["HTML"]}]},"\n",{tag:"li",props:{},children:["Try it in ",{tag:"a",props:{href:"/web-components/tsx"},children:["JSX view"]}]},"\n"]},"\n"])}}],["/web-components/tsx",class extends o.a{constructor(){super(...arguments),this.view=(t=>o.b.createElement(o.b.Fragment,null,o.b.createElement("h1",null,"Web Component - tsx"),o.b.createElement("div",null,"web components used in component jsx view"),o.b.createElement("my-img",{src:"/logo.png"})))}}]];var i=n(2);const a={title:i.c,element:i.a,nav:i.b,sidebar:[{link:"/apprun-site",text:"/apprun-site"},{link:"/configuration",text:"/configuration"},{link:"/configuration/layout",text:"/configuration/layout"},{link:"/configuration/nav",text:"/configuration/nav"},{link:"/configuration/sidebar",text:"/configuration/sidebar"},{link:"/configuration/theme",text:"/configuration/theme"},{link:"/deploy/firebase",text:"/deploy/firebase"},{link:"/deploy/github",text:"/deploy/github"},{link:"/deploy",text:"/deploy"},{link:"/features",text:"/features"},{link:"/how-it-works",text:"/how-it-works"},{link:"/",text:"/"},{link:"/todo",text:"/todo"},{link:"/web-components",text:"/web-components"},{link:"/web-components/md",text:"/web-components/md"},{link:"/web-components/tsx",text:"/web-components/tsx"}],layout:({title:t,element:e,nav:n,sidebar:s})=>o.c.createElement(o.c.Fragment,null,o.c.createElement("nav",{class:"main-nav",markdown:"0"},o.c.createElement("a",{class:"nav-title",href:"/"},t),o.c.createElement("div",{class:"flex"}),n.map(t=>o.c.createElement("a",{class:"nav-item",href:t.link},t.text)),o.c.createElement("a",{class:"icon",href:"https://github.com/yysun/apprun-site",title:"GitHub"},o.c.createElement("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"currentcolor"},o.c.createElement("path",{d:"M12,2C6.48,2,2,6.59,2,12.25c0,4.53,2.87,8.37,6.84,9.73c0.5,0.09,0.68-0.22,0.68-0.49c0-0.24-0.01-0.89-0.01-1.74c-2.78,0.62-3.37-1.37-3.37-1.37c-0.45-1.18-1.11-1.5-1.11-1.5c-0.91-0.64,0.07-0.62,0.07-0.62c1,0.07,1.53,1.06,1.53,1.06c0.89,1.57,2.34,1.11,2.91,0.85c0.09-0.66,0.35-1.11,0.63-1.37c-2.22-0.26-4.56-1.14-4.56-5.07c0-1.12,0.39-2.03,1.03-2.75c-0.1-0.26-0.45-1.3,0.1-2.71c0,0,0.84-0.28,2.75,1.05c0.8-0.23,1.65-0.34,2.5-0.34c0.85,0,1.7,0.12,2.5,0.34c1.91-1.33,2.75-1.05,2.75-1.05c0.55,1.41,0.2,2.45,0.1,2.71c0.64,0.72,1.03,1.63,1.03,2.75c0,3.94-2.34,4.81-4.57,5.06c0.36,0.32,0.68,0.94,0.68,1.9c0,1.37-0.01,2.48-0.01,2.81c0,0.27,0.18,0.59,0.69,0.49c3.97-1.36,6.83-5.2,6.83-9.73C22,6.59,17.52,2,12,2"})))),o.c.createElement("main",{class:"wrapper"},o.c.createElement("nav",{class:"side-nav"},o.c.createElement("button",{id:"toggleNavButton"},"Menu"),o.c.createElement("ul",null,s.map(t=>o.c.createElement("li",null,o.c.createElement("a",{href:t.link},t.text))))),o.c.createElement("article",{id:e}))),pages:r};s.default.start(a)}]);
//# sourceMappingURL=app.js.map