import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { Data } from "@/app/lib/models/User";

export async function PUT(request: any) {
  try {
    await dbConnect();

    const { id, title, description, country, updatingUser } =
      await request.json();
    if (!id || !title || !description || !country) {
      return new Response(
        JSON.stringify({ error: "missing some fields in data" }),
        {
          status: 400,
        }
      );
    }

    const data = await Data.findByIdAndUpdate(id, {
      title,
      description,
      country,
      lastModifiedBy: updatingUser,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
