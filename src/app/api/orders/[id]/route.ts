import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Order from "../../../../models/Order";
import { dbConnect } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: any) {
  try {
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
    const res = await fetch("http://ippanel.com/api/select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        op: process.env.OP,
        user: process.env.USER,
        pass: process.env.PASS,
        fromNum: process.env.FROMNUM,
        toNum: order.phone,
        patternCode: process.env.PATTERNCODE,
        inputData: [
          {
            accesslink: `${process.env.NEXT_PUBLIC_BASE_URL}/show/${String(
              order.accessKey
            )}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`SMS API responded with status: ${res.status}`);
    }

    const smsResponse = await res.json();
    console.log({ smsResponse });

    if (smsResponse) {
      // Mark order as completed
      order.status = "completed";
      order.accessLink = String(link);
      await order.save();
      return NextResponse.json({
        message: "لینک با موفقیت ارسال شد.",
        link: order.accessKey,
      });
    } else {
      throw new Error("Invalid SMS response");
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "مشکلی در پردازش درخواست به وجود آمده است." },
      { status: 500 }
    );
  }
}
