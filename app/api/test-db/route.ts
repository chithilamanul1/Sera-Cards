import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Attempt a simple query to check database connectivity and schema
    const clientCount = await prisma.client.count();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection is working perfectly!",
      clientCount,
    });
  } catch (error: any) {
    // Return the exact error message so we know why it's failing
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection or schema failed.",
        error_details: error.message,
        error_name: error.name,
      },
      { status: 500 }
    );
  }
}
