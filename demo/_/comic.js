import action from '../../action.js';

// server side code
const comic = async () => {
  let response = await fetch('https://xkcd.com/info.0.json');
  const current = await response.json();
  const num = Math.floor(Math.random() * current.num) + 1;
  response = await fetch(`https://xkcd.com/${num}/info.0.json`);
  return response.json();
}

// made available on the client side
export default action(comic, 'comic');