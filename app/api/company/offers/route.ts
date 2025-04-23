import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { title, description, discountValue, validFrom, validUntil, companyId, eligibleCompanies } =
      await request.json()

    // Create new offer
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        discountValue,
        validFrom,
        validUntil,
        companyId,
        eligibleCompanies: eligibleCompanies || [],
      },
    })

    return NextResponse.json({ success: true, offerId: offer.id })
  } catch (error) {
    console.error("Offer creation error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // Get all offers for the company
    const offers = await prisma.offer.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ offers })
  } catch (error) {
    console.error("Get offers error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
