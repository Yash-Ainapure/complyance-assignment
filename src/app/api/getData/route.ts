import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
