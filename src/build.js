const app = require('apprun').app;

app.on('pre-build', () => console.log('Build started'))
app.on('post-build', ()=>console.log('Build done.'))

app.on('build', () => console.log('Build'))