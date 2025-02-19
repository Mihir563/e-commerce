// app/(shop)/[id]/page.jsx
async function getProduct(id) {
  const res = await fetch(`https://fakestoreapi.com/products`);
  return res.json();
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  return (
    <div className="p-6">
      <h1 className="text-3xl">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg font-bold">${product.price}</p>
    </div>
  );
}
