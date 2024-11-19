import { Data } from "@/app/lib/models/User";
import dbConnect from "../../lib/mongodb";

export async function DELETE(req: Request): Promise<Response> {
  try {
    await dbConnect();
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      const deletedData = await Data.findByIdAndDelete(id);
      if (!deletedData) {
        console.log(deletedData);
        return new Response(JSON.stringify({ error: "Data not found" }), {
          status: 404,
        });
      }
      return new Response(
        JSON.stringify({ message: "Data deleted successfully" }),
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: "Failed to delete data2" }), {
        status: 500,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to delete data3" }), {
      status: 500,
    });
  }
}
