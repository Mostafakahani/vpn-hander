import { Product } from "@/lib/products";
import React, { useState } from "react";

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
    <form onSubmit={handleSubmit} className="mt-4">
      <h2 className="text-xl font-semibold mb-2">تکمیل سفارش</h2>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-1">
          شماره تماس (اجباری)
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          در صورت اشتباه وارد کردن شماره تماس، لینک برای شما ارسال نخواهد شد.
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">
          ایمیل (اختیاری)
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">جزئیات سفارش:</h3>
        <p>
          {product.volume} - {product.duration}
        </p>
        <p>قیمت: {product.price.toLocaleString()} تومان</p>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        ورود به صفحه پرداخت
      </button>
    </form>
  );
};

export default OrderForm;
