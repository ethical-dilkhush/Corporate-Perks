import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, description, website, contactEmail, contactName } = await request.json()

    // Create new company with pending status
    const company = await prisma.company.create({
      data: {
        name,
        description,
        website,
        status: "PENDING",
      },
    })

    // Create user with company role
    const user = await prisma.user.create({
      data: {
        email: contactEmail,
        name: contactName,
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
