export default (req, res) => {
  const products = [1, 2, 3, 4, 5].map(id => ({
    id,
    name: `Product ${id}`,
  }))
  res.json(products);
}