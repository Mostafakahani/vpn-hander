// app/api/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { dbConnect } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!orderId || !authority || status !== "OK") {
    return NextResponse.json(
      { status: false, message: "پرداخت ناموفق" },
      { status: 400 }
    );
  }
  await dbConnect();

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { status: false, message: "سفارشی پیدا نشد." },
        { status: 400 }
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
          amount: order.product.price, /////order.product.price,
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
      return NextResponse.json(
        { status: true, code: order.accessKey },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { status: false, code: order.accessKey },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("خطا در بررسی پرداخت:", error);
    return NextResponse.json({ status: false }, { status: 400 });
  }
}
