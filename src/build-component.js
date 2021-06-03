const fs = require('fs');
const events = require('./events');

app.on(`${events.BUILD}:component`, (page, element, target) => {

  const code = `
const FC = () =>  html\`${page.content}\`;
app.render(${element}, app.h(FC))
//export default FC;
`;
  fs.writeFileSync(target, code);
});