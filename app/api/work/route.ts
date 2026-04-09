import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({
            error: "Unauthorised",
            success: false
        }, { status: 401 })
    }

    const isUserExists = await prisma.user.findUnique({
        where: {
            email: session.user?.email!
        }
    })
    if (!isUserExists) {
        return NextResponse.json({
            error: "User not found. Signin again",
            success: false
        }, { status: 402 })
    }

    const getUser = await prisma.myUser.findUnique({
        where: {
            userId: isUserExists.id
        }
    })

    if (!getUser) {
        return NextResponse.json({
            error: "User Not Found. Signin again.",
            success: false
        }, { status: 404 })
    }

    const { title, description, photo, isActive, lat, lng , address } = await request.json()
    const createWork = await prisma.work.create({
        data: {
            isActive: isActive, 
            userId: getUser.id,
            address,
            title,
            description,
            lat: Number(lat),
            lng: Number(lng),
            photo: photo
        },
    })
    console.log(createWork)
    return NextResponse.json({
        success: true,
        msg: "work created successfully"
    })
}

export async function GET(request: NextRequest) {
    const session = await auth()

    if (!session) {
        return NextResponse.json({
            error: "Unauthorised",
            success: false
        }, { status: 401 })
    }

    const isUserExists = await prisma.user.findUnique({
        where: {
            email: session.user?.email!
        }
    })

    if (!isUserExists) {
        return NextResponse.json({
            error: "User not found. Signin again",
            success: false
        }, { status: 402 })
    }

    const getUser = await prisma.myUser.findUnique({
        where: {
            userId: isUserExists.id
        }
    })

    if (!getUser) {
        return NextResponse.json({
            error: "Create profile first",
            success: false
        })
    }

    // Cache key
    const cacheKey = `userWork:${getUser.id}`

    // Check cache
    const cached = await redis.get(cacheKey)

    if (cached) {
        console.log("Cache Hit")
        return NextResponse.json({
            success: true,
            allWork: cached
        })
    }

    console.log("Cache Miss")

    const allWork = await prisma.work.findMany({
        where: {
            userId: getUser.id
        },
        omit: {
            userId: true,
        }
    })

    if (!allWork || allWork.length === 0) {
        return NextResponse.json({
            success: true,
            msg: "Work not exists"
        }, { status: 200 })
    }

    // Store in redis
    await redis.set(cacheKey, allWork, {
        ex: 60
    })

    return NextResponse.json({
        success: true,
        allWork
    })
}
