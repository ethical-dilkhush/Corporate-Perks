import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as "ACTIVE" | "USED" | "EXPIRED" | null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Build query
    const query: any = {
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        offer: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }

    // Get coupons
    const coupons = await prisma.coupon.findMany(query)

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error("Get coupons error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
