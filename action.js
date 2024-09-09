//@ts-ignore
const is_on_server = typeof process !== 'undefined' && process.versions && process.versions.node;

export default (fn, path) => async (...args) => {
  if (is_on_server) {
    return await fn(...args);
  } else {
    return fetch(`/_/${path || fn.name}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      });
  }
}