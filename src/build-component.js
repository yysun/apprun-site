const fs = require('fs');
const events = require('./events');
app.on(`${events.BUILD}:component`, (page, target) => {

  const code = `
const FC = () =>  html\`${page.content}\`;
app.render(${page.element || 'document.body'}, app.h(FC))
//export default FC;
`;
  fs.writeFileSync(target, code);
  
});