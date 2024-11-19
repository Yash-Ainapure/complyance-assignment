import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function POST(request: Request): Promise<Response> {
  try {
    await dbConnect();

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: "Invalid JSON input" }), {
        status: 400,
      });
    }
    const id = body?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }
    const users = await User.find({
      id: id,
    });
    if (!users) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user data" }),
      {
        status: 500,
      }
    );
  }
}
