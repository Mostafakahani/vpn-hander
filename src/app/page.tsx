"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductSelector from "../components/ProductSelector";
import OrderForm from "../components/OrderForm";
import { Product } from "../lib/products";

function SearchParamsWrapper({ setSearchParamsState }: any) {
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchParamsState({
      authority: searchParams.get("Authority") || "",
      status: searchParams.get("Status") || "",
      orderId: searchParams.get("code") || "",
    });
  }, [searchParams, setSearchParamsState]);

  return null; // We don't render anything here.
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();
  const [searchParamsState, setSearchParamsState] = useState({
    authority: "",
    status: "",
    orderId: "",
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOrderSubmit = async (orderData: {
    phone: string;
    email?: string;
  }) => {
    if (!selectedProduct) {
      window.alert("لطفاً ابتدا یک محصول انتخاب کنید.");
      return;
    }

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify({
          productId: selectedProduct.id,
          phone: orderData.phone,
          email: orderData.email,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.url) {
        router.push(data.url);
      } else {
        window.alert(
          "مشکلی در اتصال به صفحه پرداخت به وجود آمده است. بعدا مجددا تلاش کنید."
        );
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      window.alert("خطایی در ثبت سفارش رخ داد. لطفا دوباره تلاش کنید.");
    }
  };

  useEffect(() => {
    const checkPayment = async () => {
      const { authority, status, orderId } = searchParamsState;
      if (authority && status === "OK" && orderId) {
        try {
          const res = await fetch(
            `/api/payment/callback?orderId=${orderId}&Authority=${authority}&Status=${status}`,
            { method: "GET", cache: "no-cache" }
          );
          const data = await res.json();
          console.log({ data });
          // Handle successful payment here
        } catch (error) {
          console.error("Error checking payment:", error);
        }
      }
    };
    checkPayment();
  }, [searchParamsState]);

  if (searchParamsState.orderId && searchParamsState.status === "OK") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">سفارش با موفقیت ثبت شد</h1>
        <p>بزودی لینک برای شما ارسال خواهد شد.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper setSearchParamsState={setSearchParamsState} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">انتخاب محصول</h1>
        <ProductSelector onSelect={handleProductSelect} />
        {selectedProduct && (
          <OrderForm product={selectedProduct} onSubmit={handleOrderSubmit} />
        )}
      </div>
    </Suspense>
  );
}
