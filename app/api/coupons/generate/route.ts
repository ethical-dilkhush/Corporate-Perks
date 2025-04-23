import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { offerId } = await request.json()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get offer details
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { company: true },
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Check if offer is valid
    const now = new Date()
    if (now < offer.validFrom || now > offer.validUntil) {
      return NextResponse.json({ error: "Offer is not active" }, { status: 400 })
    }

    // Check if user already has an active coupon for this offer
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        userId,
        offerId,
        status: "ACTIVE",
      },
    })

    if (existingCoupon) {
      return NextResponse.json(
        { error: "You already have an active coupon for this offer", coupon: existingCoupon },
        { status: 200 },
      )
    }

    // Generate unique coupon code
    const companyPrefix = offer.company.name.substring(0, 3).toUpperCase()
    const discountPrefix = `${offer.discountValue}`
    const uniqueId = uuidv4().substring(0, 6).toUpperCase()
    const code = `${companyPrefix}${discountPrefix}-${uniqueId}`

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        code,
        userId,
        offerId,
        status: "ACTIVE",
      },
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error) {
    console.error("Coupon generation error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
