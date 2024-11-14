import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

// Mock product data (later you can fetch this from an API)
const products: Product[] = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "RGB backlit mechanical gaming keyboard",
    imageUrl: "https://placehold.co/400x300"
  },
  {
    id: 2,
    name: "Gaming Mouse",
    price: 59.99,
    description: "High DPI gaming mouse with programmable buttons",
    imageUrl: "https://placehold.co/400x300"
  },
  // Add more products as needed
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Cross Board</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
} 