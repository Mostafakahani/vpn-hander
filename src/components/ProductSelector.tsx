import React, { useRef } from "react";
import { products, Product } from "../lib/products";
import { ChevronLeft, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ShimmerButton from "./ui/shimmer-button";
import { AnimatedShinyTextDemo } from "./ui/AnimatedShinyTextDemo";
import { cn } from "@/lib/utils";
import { LivePingDemo } from "./ui/LivePingDemo";

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSelect = (product: Product) => {
    onSelect(product);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        انتخاب پلن VPN
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className={cn(
              "transform transition-all duration-300 hover:scale-105",
              "bg-gradient-to-br from-white to-gray-100",
              "border-2 border-transparent hover:border-blue-500",
              "shadow-lg hover:shadow-xl rounded-2xl overflow-hidden"
            )}
          >
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <CardTitle className="text-2xl font-bold text-center">
                اکانت {product.duration}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-gray-800">
                  {product.price} تومان
                </p>
                <p className="text-lg text-gray-600">{product.volume} حجم</p>
              </div>
              <div className="space-y-3">
                <FeatureItem text="بدون محدودیت کاربر" />
                <FeatureItem text="سرعت بالا و عملکرد عالی" />
                <FeatureItem text="اتصال دائمی، پایدار و مطمئن" />
              </div>
              <div className="pt-4">
                <div className="container mx-auto p-4">
                  <h1 className="text-xl font-normal mb-4 text-center ">
                    - تست سرعت VPN-
                  </h1>
                  <LivePingDemo />
                </div>
                <div className="w-full flex justify-center ">
                  <ShimmerButton
                    onClick={() => handleSelect(product)}
                    className="py-3 text-lg font-semibold"
                  >
                    انتخاب پلن
                    <ChevronLeft className="mr-2 h-5 w-5" />
                  </ShimmerButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center space-x-2 rtl:space-x-reverse">
    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
    <AnimatedShinyTextDemo text={text} />
  </div>
);

export default ProductSelector;
