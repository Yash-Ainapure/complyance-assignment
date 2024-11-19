import dbConnect from "../../lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function POST(request: Request): Promise<Response> {
  try {
    console.log("requestggsss");
    console.log("request", request);
    await dbConnect();
    const body: { email: string; role: string; id: string } =
      await request.json();
    const user = new User(body);
    // const { _doc, ...rest } = user.toObject();
    // console.log(rest);
    user.username = "test";
    if (!body.email || !body.role || !body.id) {
      return new Response(
        JSON.stringify({
          error: "Missing some required fields",
          dto: user,
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
  } catch (error: unknown) {
    console.log(error);
    const errorMessage =
      (error as { errmsg?: string }).errmsg || "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to create user.", erobj: errorMessage }),
      {
        status: 500,
      }
    );
  }
}
