import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function PUT(request: Request): Promise<Response> {
  try {
    await dbConnect();

    const { id, assignedCountry } = await request.json();
    if (!id || !assignedCountry) {
      return new Response(
        JSON.stringify({ error: "missing some fields in data" }),
        {
          status: 400,
        }
      );
    }

    const data = await User.findByIdAndUpdate(
      id,
      { assignedCountry },
      { new: true }
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
