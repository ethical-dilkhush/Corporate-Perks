import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const offerId = params.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get offer details
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        company: true,
      },
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Check if user has a coupon for this offer
    const coupon = await prisma.coupon.findFirst({
      where: {
        userId,
        offerId,
      },
    })

    return NextResponse.json({ offer, coupon })
  } catch (error) {
    console.error("Get offer error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
