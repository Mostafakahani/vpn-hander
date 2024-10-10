"use client";
import React from "react";
import { products, Product } from "../lib/products";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ShimmerButton from "./ui/shimmer-button";
import AnimatedShinyText from "./ui/animated-shiny-text";
import { AnimatedShinyTextDemo } from "./ui/AnimatedShinyTextDemo";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {products.map((product) => (
        <Card
          key={product.id}
          className="hover:shadow-lg hover:scale-105 transition-transform duration-300 border border-gray-200 rounded-xl"
        >
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-t-xl">
            <CardTitle className="text-xl font-semibold">
              اکانت {product.duration}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-2xl font-bold text-gray-700">
                {product.volume}
              </p>
              <p className="text-2xl font-bold text-gray-700">
                {product.price}
              </p>
              <AnimatedShinyTextDemo text="بدون محدودیت کاربر" />
              <AnimatedShinyTextDemo text="اتصال دائمی، پایدار و مطمئن" />
              <AnimatedShinyTextDemo text="سرعت با عملکرد عالی و پینگ پایین" />

              <div className="w-full flex flex-row justify-end">
                <ShimmerButton
                  onClick={() => onSelect(product)}
                  className="mt-4"
                >
                  انتخاب پلن <ChevronLeft className="mr-2 h-4 w-4" />
                </ShimmerButton>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductSelector;
