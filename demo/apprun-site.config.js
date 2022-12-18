// import a from 'markdown-it-anchor';
// import b from 'markdown-it-table-of-contents';

export default {
  // asserts: ['*.json'],
  plugins: {
    '.css': tailwindcss,
  }
}

// app.on('build:markdown', text => {
//   md.use(a);
//   md.use(b);
// });

async function tailwindcss (file, { output }) {
  console.log('!!!');
}