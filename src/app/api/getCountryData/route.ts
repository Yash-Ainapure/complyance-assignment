import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { Data } from "@/app/lib/models/User";

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
    console.log("body", body);
    if (!body.country) {
      return new Response(
        JSON.stringify({ error: "Country is required", dto: body }),
        {
          status: 400,
        }
      );
    }
    const data = await Data.find({ country: body.country });
    console.log("datahdudh");
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
