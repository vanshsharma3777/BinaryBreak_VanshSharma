import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorised", success: false },
      { status: 401 }
    );
  }

  const { role } = await params;
  const normalizedRole = role.toLowerCase().trim();

  const person = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!person) {
    return NextResponse.json(
      {
        error: "User not found. Create your profile first",
        success: false,
      },
      { status: 404 }
    );
  }

  const cacheKey = `persons:${normalizedRole}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("Cache hit");
    return NextResponse.json({
      success: true,
      allPerson: cached,
    });
  }

  console.log("Cache miss");

  let allPerson = null;

  if (normalizedRole === "worker") {
    allPerson = await prisma.myWorker.findMany({
      where: { role: normalizedRole },
      omit: {
        userId: true,
      },
    });
  } else if (normalizedRole === "vendor") {
    allPerson = await prisma.myVendor.findMany({
      where: { role: normalizedRole },
      omit: {
        userId: true,
      },
    });
  }

  if (!allPerson || allPerson.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: `No ${role} found`,
      },
      { status: 200 }
    );
  }

  await redis.set(cacheKey, allPerson, {
    ex: 300,
  });

  return NextResponse.json({
    success: true,
    allPerson,
  });
}