import action from '../../../action';

export default async (data?: {num: number}) => {
  //#if server
  const num = data?.num || Math.floor(Math.random() * 2990) + 1;
  const response = await fetch(`https://xkcd.com/${num}/info.0.json`);
  return response.json();
  //#else
  return action('comic', data);
  //#endif
}
