// app/api/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!orderId || !authority || status !== "OK") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=پرداخت_ناموفق`
    );
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}?error=سفارش_پیدا_نشد`
      );
    }

    // ارسال درخواست تایید پرداخت از طریق زرین‌پال
    const response = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: 1000, /////order.product.price,
          authority: authority,
        }),
      }
    );

    // Parse the response as JSON
    const data = await response.json();
    console.log("data on callback: ", data);
    if (data.data.code === 100) {
      order.paymentStatus = "completed";
      await order.save();
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}?code=${orderId}`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}?error=تایید_پرداخت_ناموفق`
      );
    }
  } catch (error) {
    console.error("خطا در بررسی پرداخت:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=خطای_سرور`
    );
  }
}
