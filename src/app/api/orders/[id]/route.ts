import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Order from "../../../../models/Order";
import { dbConnect } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { link } = await req.json();

  await dbConnect();
  const order = await Order.findById(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Sending SMS using fetch
  //   const res = await fetch("http://ippanel.com/api/select", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json", // Set the headers
  //     },
  //     body: JSON.stringify({
  //       op: process.env.OP,
  //       user: process.env.USER,
  //       pass: process.env.PASS,
  //       fromNum: process.env.FROMNUM,
  //       toNum: order.phone,
  //       patternCode: process.env.PATTERNCODE,
  //       inputData: [{ verification: "00000", link: order.accessKey }], // Correct structure
  //     }),
  //   });

  //   const smsResponse = await res.json();

  //   if (smsResponse?.data) {
  // Mark order as completed
  order.status = "completed";
  order.accessLink = String(link);
  await order.save();
  return NextResponse.json({
    message: "لینک با موفقیت ارسال شد.",
    link: order.accessKey,
  });
  //   }

  //   return NextResponse.json(
  //     { error: "مشکلی در ارسال پیامک به وجود آمده است." },
  //     { status: 400 }
  //   );
}
