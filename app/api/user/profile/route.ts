import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")
    const { name } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
