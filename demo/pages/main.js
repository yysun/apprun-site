// src/main.tsx
import app2 from "apprun";

// src/Layout.tsx
import app from "apprun";
app.on("//", (route) => {
  const menus = document.querySelectorAll(".navbar-nav li");
  for (let i = 0; i < menus.length; ++i) {
    menus[i].classList.remove("active");
  }
  const item = document.querySelector(`[href='${route}']`);
  item && item.parentElement.classList.add("active");
});
var Layout_default = () => /* @__PURE__ */ app.h("div", {
  class: "container"
});

// src/main.tsx
app2.render(document.body, /* @__PURE__ */ app2.h(Layout_default, null));
