import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function POST(request: any) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const user = await User.findById(body.id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
