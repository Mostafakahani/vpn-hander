import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const orders = await Order.find({
    status: "pending",
    paymentStatus: "completed",
  }).sort({
    createdAt: -1,
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await dbConnect();
  const order = new Order(body);
  await order.save();
  return NextResponse.json(
    { message: "Order created successfully" },
    { status: 201 }
  );
}
