import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { amount, currency } = await request.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency,
      receipt: "order_rcptid_11",
    });
    console.log(amount)
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
