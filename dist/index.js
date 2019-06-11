!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var s in n)("object"==typeof exports?exports:t)[s]=n[s]}}(window,function(){return function(t){var e={};function n(s){if(e[s])return e[s].exports;var o=e[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(s,o,function(e){return t[e]}.bind(null,o));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e,n){"use strict";(function(t){n.d(e,"a",function(){return x}),n.d(e,"b",function(){return i}),n.d(e,"c",function(){return _});class s{constructor(){this._events={}}on(t,e,n={}){this._events[t]=this._events[t]||[],this._events[t].push({fn:e,options:n})}off(t,e){let n=this._events[t];n&&((n=n.filter(t=>t.fn!==e)).length?this._events[t]=n:delete this._events[t])}run(t,...e){let n=this._events[t];return console.assert(!!n,"No subscriber for event: "+t),n&&((n=n.filter(n=>{const{fn:s,options:o}=n;return o.delay?this.delay(t,s,e,o):s.apply(this,e),!n.options.once})).length?this._events[t]=n:delete this._events[t]),n?n.length:0}once(t,e,n={}){this.on(t,e,Object.assign({},n,{once:!0}))}delay(t,e,n,s){s._t&&clearTimeout(s._t),s._t=setTimeout(()=>{clearTimeout(s._t),e.apply(this,n)},s.delay)}}let o;const r="object"==typeof self&&self.self===self&&self||"object"==typeof t&&t.global===t&&t;r.app&&r._AppRunVersions?o=r.app:(o=new s,r.app=o,r._AppRunVersions="AppRun-2");var i=o;let a=0;const c="_props";function h(t){const e=[],n=t=>{null!=t&&""!==t&&!1!==t&&e.push("function"==typeof t||"object"==typeof t?t:`${t}`)};return t&&t.forEach(t=>{Array.isArray(t)?t.forEach(t=>n(t)):n(t)}),e}const l={},d=function(t,e,n={}){null!=e&&(e=function t(e,n,s=0){if(0===s&&(a=0),"string"==typeof e)return e;if(Array.isArray(e))return e.map(e=>t(e,n,a++));let o=e;return e&&"function"==typeof e.tag&&Object.getPrototypeOf(e.tag).t&&(o=function(t,e,n){const{tag:s,props:o,children:r}=t;let a=o&&o.id,c=`_${n}_`;a?c=`_${a}_`:a=`_${n}_`,e.s||(e.s={});let h=e.s[c];h||(h=e.s[c]=new s(Object.assign({},o,{children:r})).mount(a)),h.mounted&&h.mounted(o,r);const l=h.state;let d="";return l instanceof Promise||!h.view||(d=h.view(l,o),h.rendered&&setTimeout(()=>h.rendered(l,o))),i.createElement("section",Object.assign({},o,{id:a}),d)}(e,n,a++)),o&&o.children&&(o.children=o.children.map(e=>t(e,n,a++))),o}(e,n),t&&(Array.isArray(e)?f(t,e):f(t,[e])))};function u(t,e){console.assert(!!t),function(t,e){const n=t.nodeName,s=`${e.tag||""}`;return n.toUpperCase()===s.toUpperCase()}(t,e)?(f(t,e.children),y(t,e.props)):t.parentNode.replaceChild(m(e),t)}function f(t,e){const n=Math.min(t.childNodes.length,e.length);for(let s=0;s<n;s++){const n=e[s],o=t.childNodes[s];if("string"==typeof n)o.textContent!==n&&(3===o.nodeType?o.textContent=n:t.replaceChild(p(n),o));else{const e=n.props&&n.props.key;if(e)if(o.key===e)u(t.childNodes[s],n);else{const r=l[e];r?(t.insertBefore(r,o),t.appendChild(o),u(t.childNodes[s],n)):t.insertBefore(m(n),o)}else u(t.childNodes[s],n)}}let s=t.childNodes.length;for(;s>n;)t.removeChild(t.lastChild),s--;if(e.length>n){const s=document.createDocumentFragment();for(let t=n;t<e.length;t++)s.appendChild(m(e[t]));t.appendChild(s)}}function p(t){if(0===t.indexOf("_html:")){const e=document.createElement("div");return e.insertAdjacentHTML("afterbegin",t.substring(6)),e}return document.createTextNode(t)}function m(t,e=!1){if(console.assert(null!=t),"string"==typeof t)return p(t);if(!t.tag||"function"==typeof t.tag)return p(JSON.stringify(t));const n=(e=e||"svg"===t.tag)?document.createElementNS("http://www.w3.org/2000/svg",t.tag):document.createElement(t.tag);return y(n,t.props),t.children&&t.children.forEach(t=>n.appendChild(m(t,e))),n}function y(t,e){console.assert(!!t),e=function(t,e){e.class=e.class||e.className,delete e.className;const n={};return t&&Object.keys(t).forEach(t=>n[t]=null),e&&Object.keys(e).forEach(t=>n[t]=e[t]),n}(t[c]||{},e||{}),t[c]=e;for(const n in e){const s=e[n];if("style"===n){t.style.cssText&&(t.style.cssText="");for(const e in s)t.style[e]!==s[e]&&(t.style[e]=s[e])}else if(n.startsWith("data-")){const e=n.substring(5).replace(/-(\w)/g,t=>t[1].toUpperCase());t.dataset[e]!==s&&(s||""===s?t.dataset[e]=s:delete t.dataset[e])}else"class"===n||n.startsWith("role")||n.indexOf("-")>0||t instanceof SVGElement||t.tagName.indexOf("-")>0?t.getAttribute(n)!==s&&(s?t.setAttribute(n,s):t.removeAttribute(n)):t[n]!==s&&(t[n]=s);"key"===n&&s&&(l[s]=t)}}const g={meta:new WeakMap,defineMetadata(t,e,n){this.meta.has(n)||this.meta.set(n,{}),this.meta.get(n)[t]=e},getMetadataKeys(t){return t=Object.getPrototypeOf(t),this.meta.get(t)?Object.keys(this.meta.get(t)):[]},getMetadata(t,e){return e=Object.getPrototypeOf(e),this.meta.get(e)?this.meta.get(e)[t]:null}};function _(t){return function(e){return app.webComponent(t,e),e}}const b=(t,e)=>e?t.state[e]:t.state,v=(t,e,n)=>{if(e){const s=Object.assign({},t.state);s[e]=n,t.setState(s)}else t.setState(n)};var w=(t,e,n,s)=>{if(t.startsWith("$on")){const n=e[t];if(t=t.substring(1),"boolean"==typeof n)e[t]=(e=>s.run(t,e));else if("string"==typeof n)e[t]=(t=>s.run(n,t));else if("function"==typeof n)e[t]=(t=>s.setState(n(s.state,t)));else if(Array.isArray(n)){const[o,...r]=n;"string"==typeof o?e[t]=(t=>s.run(o,...r,t)):"function"==typeof o&&(e[t]=(t=>s.setState(o(s.state,...r,t))))}}else if("$bind"===t){const o=e.type||"text",r="string"==typeof e[t]?e[t]:e.name;if("input"===n)switch(o){case"checkbox":e.checked=b(s,r),e.onclick=(t=>v(s,r||t.target.name,t.target.checked));break;case"radio":e.checked=b(s,r)===e.value,e.onclick=(t=>v(s,r||t.target.name,t.target.value));break;case"number":case"range":e.value=b(s,r),e.oninput=(t=>v(s,r||t.target.name,Number(t.target.value)));break;default:e.value=b(s,r),e.oninput=(t=>v(s,r||t.target.name,t.target.value))}else"select"===n?(e.selectedIndex=b(s,r),e.onchange=(t=>{t.target.multiple||v(s,r||t.target.name,t.target.selectedIndex)})):"option"===n&&(e.selected=b(s,r),e.onclick=(t=>v(s,r||t.target.name,t.target.selected)))}else app.run("$",{key:t,tag:n,props:e,component:s})};const O={};i.on("get-components",t=>t.components=O);const j=t=>t;class x{constructor(t,e,n,o){this.state=t,this.view=e,this.update=n,this.options=o,this._app=new s,this._actions=[],this._history=[],this._history_idx=-1,this.start=((t=null,e={render:!0})=>this.mount(t,Object.assign({},e,{render:!0})))}render(t,e){i.render(t,e,this)}renderState(t){if(!this.view)return;const e=i.createElement;i.createElement=((t,n,...s)=>(n&&Object.keys(n).forEach(e=>{e.startsWith("$")&&(w(e,n,t,this),delete n[e])}),e(t,n,...s)));const n=this.view(t);if(i.createElement=e,i.run("debug",{component:this,state:t,vdom:n||"[vdom is null - no render]"}),"object"!=typeof document)return;const s="string"==typeof this.element?document.getElementById(this.element):this.element;if(s){const t="_c";if(this.unload){if(s._component!==this&&(this.tracking_id=(new Date).valueOf().toString(),s.setAttribute(t,this.tracking_id),"undefined"!=typeof MutationObserver)){const e=new MutationObserver(t=>{const{removedNodes:n,oldValue:o}=t[0];(o===this.tracking_id||Array.from(n).indexOf(s)>=0)&&(this.unload(),e.disconnect())});s.parentNode&&e.observe(s.parentNode,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:[t]})}}else s.removeAttribute&&s.removeAttribute(t);s._component=this}this.render(s,n),this.rendered&&this.rendered(this.state)}setState(t,e={render:!0,history:!1}){if(t instanceof Promise)t.then(t=>{this.setState(t,e)}).catch(t=>{throw console.error(t),t}),this._state=t;else{if(this._state=t,null==t)return;this.state=t,!1!==e.render&&this.renderState(t),!1!==e.history&&this.enable_history&&(this._history=[...this._history,t],this._history_idx=this._history.length-1),"function"==typeof e.callback&&e.callback(this.state)}}mount(t=null,e){if(console.assert(!this.element,"Component already mounted."),this.options=e=Object.assign({},this.options,e),this.element=t,this.global_event=e.global_event,this.enable_history=!!e.history,this.enable_history){const t=()=>{this._history_idx--,this._history_idx>=0?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=0},n=()=>{this._history_idx++,this._history_idx<this._history.length?this.setState(this._history[this._history_idx],{render:!0,history:!1}):this._history_idx=this._history.length-1};this.on(e.history.prev||"history-prev",t),this.on(e.history.next||"history-next",n)}return this.add_actions(),void 0===this.state&&(this.state=null!=this.model?this.model:{}),e.render?this.setState(this.state,{render:!0,history:!0}):this.setState(this.state,{render:!1,history:!0}),O[t]=O[t]||[],O[t].push(this),this}is_global_event(t){return t&&(t.startsWith("#")||t.startsWith("/"))}add_action(t,e,n={}){e&&"function"==typeof e&&this.on(t,(...s)=>{const o=e(this.state,...s);i.run("debug",{component:this,event:t,e:s,state:this.state,newState:o,options:n}),this.setState(o,n)},n)}add_actions(){const t=this.update||{};g.getMetadataKeys(this).forEach(e=>{if(e.startsWith("apprun-update:")){const n=g.getMetadata(e,this);t[n.name]=[this[n.key].bind(this),n.options]}});const e={};Array.isArray(t)?t.forEach(t=>{const[n,s,o]=t;n.toString().split(",").forEach(t=>e[t.trim()]=[s,o])}):Object.keys(t).forEach(n=>{const s=t[n];("function"==typeof s||Array.isArray(s))&&n.split(",").forEach(t=>e[t.trim()]=s)}),e["."]||(e["."]=j),Object.keys(e).forEach(t=>{const n=e[t];"function"==typeof n?this.add_action(t,n):Array.isArray(n)&&this.add_action(t,n[0],n[1])})}run(t,...e){const n=t.toString();return this.global_event||this.is_global_event(n)?i.run(n,...e):this._app.run(n,...e)}on(t,e,n){const s=t.toString();return this._actions.push({name:s,fn:e}),this.global_event||this.is_global_event(s)?i.on(s,e,n):this._app.on(s,e,n)}unmount(){this._actions.forEach(t=>{const{name:e,fn:n}=t;this.global_event||this.is_global_event(e)?i.off(e,n):this._app.off(e,n)})}}x.t=!0;const E=(t,e={})=>(class extends HTMLElement{constructor(){super()}get component(){return this._component}get state(){return this._component.state}static get observedAttributes(){return Object.assign({},e).observedAttributes}connectedCallback(){if(this.isConnected&&!this._component){const n=Object.assign({render:!0,shadow:!1},e);this._shadowRoot=n.shadow?this.attachShadow({mode:"open"}):this;const s={};Array.from(this.attributes).forEach(t=>s[t.name]=t.value),this.children&&(s.children=Array.from(this.children),s.children.forEach(t=>t.parentElement.removeChild(t))),this._component=new t(s).mount(this._shadowRoot,n),this.on=this._component.on.bind(this._component),this.run=this._component.run.bind(this._component)}}disconnectedCallback(){this._component.unmount(),this._component=null}attributeChangedCallback(...t){this._component&&this._component.run("attributeChanged",...t)}}),k=t=>{if(t||(t="#"),t.startsWith("#")){const[e,...n]=t.split("/");i.run(e,...n)||i.run("///",e,...n),i.run("//",e,...n)}else if(t.startsWith("/")){const[e,n,...s]=t.split("/");i.run("/"+n,...s)||i.run("///","/"+n,...s),i.run("//","/"+n,...s)}else i.run(t)||i.run("///",t),i.run("//",t)};i.createElement=function(t,e,...n){const s=h(n);return"string"==typeof t?{tag:t,props:e,children:s}:Array.isArray(t)?t:void 0===t&&n?s:Object.getPrototypeOf(t).t?{tag:t,props:e,children:s}:t(e,s)},i.render=function(t,e,n){d(t,e,n)},i.Fragment=function(t,...e){return h(e)},i.webComponent=((t,e,n)=>{"undefined"!=typeof customElements&&customElements.define(t,E(e,n))}),i.start=((t,e,n,s,o)=>{const r=Object.assign({},o,{render:!0,global_event:!0}),i=new x(e,n,s);return o&&o.rendered&&(i.rendered=o.rendered),i.mount(t,r),i});const A=t=>{};i.on("$",A),i.on("debug",t=>A),i.on("//",A),i.on("#",A),i.route=k,i.on("route",t=>i.route&&i.route(t)),"object"==typeof document&&document.addEventListener("DOMContentLoaded",()=>{i.route===k&&(window.onpopstate=(()=>k(location.hash)),k(location.hash))}),"object"==typeof window&&(window.Component=x,window.React=i),e.d=i}).call(this,n(2))},function(t,e,n){"use strict";n.r(e);var s=n(0);e.default={start:t=>{((t="/")=>{const e=(e,n)=>{n&&n.preventDefault(),e=(e=e.replace(/\/$/,""))||t,s.d.run(e)||s.d.run(`${t}_404`)};if(t.startsWith("#")&&s.d.on("///",()=>s.d.run(`${t}_404`)),t.startsWith("/")){document.addEventListener("DOMContentLoaded",()=>{window.onpopstate=(()=>e(location.pathname)),e(location.pathname)}),window.onclick=(e=>t(e));const t=t=>{const n=t.target;let s=n.href;s&&s.startsWith(document.location.origin)&&(t.preventDefault(),history.pushState(null,"",n.pathname),e(n.pathname))}}})(t.eventRoot),s.d.render(document.body,s.d.createElement(t.layout,Object.assign({},t)));const e=document.getElementById(t.element);t.pages.forEach(t=>{const[n,o]=t,r=(new o).mount(e);s.d.on(n,(...t)=>r.run(".",...t))})}}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n}])});
//# sourceMappingURL=index.js.map