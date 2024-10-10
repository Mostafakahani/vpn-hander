// app/api/payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { products } from "@/lib/products";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  console.log("post payment");
  try {
    const { productId, phone, email } = await req.json();
    await dbConnect();

    // محصول انتخابی را پیدا کنید
    const selectedProduct = products.find((p) => p.id === productId);
    if (!selectedProduct) {
      return NextResponse.json(
        { success: false, message: "محصول انتخابی یافت نشد." },
        { status: 400 }
      );
    }

    // ایجاد یک سفارش جدید
    const newOrder = new Order({
      product: selectedProduct,
      phone,
      email,
    });

    // سفارش را در پایگاه داده ذخیره کنید
    await newOrder.save();

    // شروع پرداخت از طریق زرین‌پال
    const response = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: selectedProduct.price, //// selectedProduct.price
          description: `VPN: ${selectedProduct.volume} برای ${selectedProduct.duration}`,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}?code=${newOrder._id}`,
          metadata: {
            email: email || "",
            phone: phone,
          },
        }),
      }
    );

    // Parse the response as JSON
    const data = await response.json();
    console.log(data.errors);
    if (data.data.code === 100) {
      const payment_url = `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;
      return NextResponse.json(
        { success: true, url: payment_url },
        { status: 200 }
      );
    } else {
      // در صورت شکست پرداخت، سفارش را حذف کنید
      await Order.findByIdAndDelete(newOrder._id);
      return NextResponse.json(
        { success: false, message: "خطا در ایجاد پرداخت." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("خطا در شروع پرداخت:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}
