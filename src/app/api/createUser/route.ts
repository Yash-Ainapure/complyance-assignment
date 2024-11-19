import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function POST(request: any) {
  try {
    console.log("requestggsss");
    console.log("request", request);
    await dbConnect();
    const body = await request.json();
    let user = new User(body);
    const { _doc, ...rest } = user.toObject();
    user.username = "test";
    if (!body.email || !body.role || !body.id) {
      return new Response(
        JSON.stringify({
          error: "Missing some required fields",
          dto:user
        }),
        {
          status: 400,
        }
      );
    }

    await user.save();
    return new Response(JSON.stringify({ message: "User created" }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to create user.", erobj: error.errmsg }),
      {
        status: 500,
      }
    );
  }
}
