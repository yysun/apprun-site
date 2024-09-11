export default path => {
  if (!path) path = '';
  const routes = [];
  const paths = [...path.split('/').filter(p => !!p), ''];
  if (paths.length === 0) paths.push('');
  for (let i = 0; i < paths.length; i++) {
    const route = '/' + paths.slice(0, i).join('/');
    const params = paths.slice(i).filter(p => !!p);
    routes.push([route, params]);
  }
  return routes;
}