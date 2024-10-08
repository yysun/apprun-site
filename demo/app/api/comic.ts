export default async (req, res) => {
  // let response = await fetch('https://xkcd.com/info.0.json');
  // const current = await response.json();
  // const num = Math.floor(Math.random() * current.num) + 1;
  const num = Math.floor(Math.random() * 2990) + 1;
  const response = await fetch(`https://xkcd.com/${num}/info.0.json`);
  const comic = await response.json();
  res.json(comic);
}
