import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import { Data } from "@/app/lib/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["title", "country", "createdBy", "description"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
        });
      }
    }

    // Convert createdBy to ObjectId
    const { ObjectId } = require('mongodb');
    if (ObjectId.isValid(body.createdBy)) {
      body.createdBy = new ObjectId(body.createdBy);
    } else {
      return new Response(JSON.stringify({ error: "Invalid createdBy value" }), {
        status: 400,
      });
    }

    // Create a new data entry
    const newData = new Data(body);
    const savedData = await newData.save();

    return NextResponse.json(savedData, { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to create data entry" }),
      {
        status: 500,
      }
    );
  }
}
