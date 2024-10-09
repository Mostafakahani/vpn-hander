import React from "react";
import { products, Product } from "../lib/products";

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <button
          key={product.id}
          className="p-4 border rounded hover:bg-gray-100"
          onClick={() => onSelect(product)}
        >
          <h2 className="text-lg font-semibold">{product.volume}</h2>
          <p>{product.duration}</p>
          <p>{product.price.toLocaleString()} تومان</p>
        </button>
      ))}
    </div>
  );
};

export default ProductSelector;
