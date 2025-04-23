import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const companyId = searchParams.get("companyId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    })

    // Current date
    const now = new Date()

    // Build query
    const query: any = {
      where: {
        validFrom: { lte: now },
        validUntil: { gte: now },
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { company: { name: { contains: search, mode: "insensitive" } } },
          ],
        }),
        ...(companyId && { companyId }),
        OR: [{ eligibleCompanies: { has: user?.companyId || "" } }, { eligibleCompanies: { isEmpty: true } }],
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }

    // Get offers
    const offers = await prisma.offer.findMany(query)

    return NextResponse.json({ offers })
  } catch (error) {
    console.error("Get offers error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
