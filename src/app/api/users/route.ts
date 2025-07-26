import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle GET requests to /api/users
export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

// Handle POST requests to /api/users (for creating a user)
export async function POST(request: Request) {
  try {
    const { email, name, password, role } = await request.json();

    // Basic validation (more robust validation will come in Chapter 2)
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // For now, we're not hashing the password. We'll add that in Chapter 2.
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password, // Store as plain text for now, will hash later
        role: role || "AUTHOR", // Default role to AUTHOR if not provided
      },
    });

    // Exclude password from the response for security
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
