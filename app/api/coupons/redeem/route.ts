import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: { offer: true },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    // Check if coupon belongs to the user
    if (coupon.userId !== userId) {
      return NextResponse.json({ error: "This coupon does not belong to you" }, { status: 403 })
    }

    // Check if coupon is active
    if (coupon.status !== "ACTIVE") {
      return NextResponse.json({ error: `Coupon is ${coupon.status.toLowerCase()}` }, { status: 400 })
    }

    // Check if offer is still valid
    const now = new Date()
    if (now > coupon.offer.validUntil) {
      // Update coupon status to expired
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { status: "EXPIRED" },
      })
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 })
    }

    // Update coupon status to used
    const updatedCoupon = await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        status: "USED",
        redeemedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, coupon: updatedCoupon })
  } catch (error) {
    console.error("Coupon redemption error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
