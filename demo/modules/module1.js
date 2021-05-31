const app = require('apprun').app;

app.on('begin-site', () => {
  console.log('begin-site');
})

app.on('end-site', () => {
  console.log('end-site');

})