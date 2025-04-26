import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const {
      name,
      industry,
      address,
      city,
      state,
      country,
      postalCode,
      contactName,
      contactEmail,
      contactPhone,
      website,
      taxId,
      description,
    } = await request.json()

    // Create new company with pending status
    const company = await prisma.company.create({
      data: {
        name,
        industry,
        address,
        city,
        state,
        country,
        postalCode,
        website,
        taxId,
        description,
        status: "PENDING",
      },
    })

    // Create user with company role
    const user = await prisma.user.create({
      data: {
        email: contactEmail,
        name: contactName,
        phone: contactPhone,
        role: "COMPANY",
        companyId: company.id,
      },
    })

    // In a real implementation, you would send an email notification to the admin

    return NextResponse.json({ success: true, companyId: company.id })
  } catch (error) {
    console.error("Company registration error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
