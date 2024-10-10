import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../models/Order";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: NextRequest, { params }: any) {
  const { code } = params;
  console.log(code);
  if (!code)
    return NextResponse.json({ error: "هیچ کدی پیدا نشد." }, { status: 400 });
  await dbConnect();
  const order = await Order.findOne({ accessKey: code });
  if (!order) {
    return NextResponse.json({ error: "هیچ لینکی پیدا نشد." }, { status: 404 });
  }

  return NextResponse.json({
    message: "لینک با موفقیت پیدا شد.",
    link: order.accessLink,
    status: order.paymentStatus,
  });
}
