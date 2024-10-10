import React, { useState } from "react";
import { Product } from "@/lib/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";

interface OrderFormProps {
  product: Product;
  onSubmit: (orderData: {
    product: Product;
    phone: string;
    email?: string;
  }) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ product, phone, email });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">تکمیل سفارش</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-right block">
              شماره تماس (اجباری)
            </Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full text-right"
              dir="rtl"
            />
            <p className="text-sm text-gray-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              در صورت اشتباه وارد کردن شماره تماس، لینک برای شما ارسال نخواهد
              شد.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block">
              ایمیل (اختیاری)
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-right"
              dir="rtl"
            />
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-right">
              جزئیات سفارش:
            </h3>
            <p className="text-right">
              {product.volume} - {product.duration}
            </p>
            <p className="text-right font-bold text-lg mt-2">
              قیمت: {product.price.toLocaleString()} تومان
            </p>
          </div>
          <RainbowButton type="submit" className="w-full">
            ورود به صفحه پرداخت
          </RainbowButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
