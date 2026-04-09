import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth()

    if (!session) {
        return NextResponse.json({
            error: "Unauthorised",
            success: false
        }, { status: 401 })
    }

    const isPersonExists = await prisma.user.findUnique({
        where: {
            email: session.user?.email!
        }
    })

    if (!isPersonExists) {
        return NextResponse.json({
            error: "User not found. Signin again",
            success: false
        }, { status: 402 })
    }

    const isWorkerExists = await prisma.myWorker.findUnique({
        where: {
            userId: isPersonExists.id
        }
    })

    if (!isWorkerExists) {
        return NextResponse.json({
            error: "Create worker's profile first",
            success: false
        }, { status: 402 })
    }

    const cacheKey = "activeWork"
    const cached = await redis.get(cacheKey)

    if (cached) {
        console.log("Cache Hit")
        return NextResponse.json({
            allWork: cached,
            success: true
        })
    }

    console.log("Cache Miss")

    const allWork = await prisma.work.findMany({
        where: {
            isActive: true
        },
        omit: {
            id: true,
            userId: true
        },
        include: {
            user: {
                omit: {
                    id: true,
                    userId: true
                }
            }
        }
    })

    if (!allWork || allWork.length === 0) {
        return NextResponse.json({
            msg: "No active work",
            success: true
        }, { status: 200 })
    }

    await redis.set(cacheKey, allWork, {
        ex: 300
    })

    return NextResponse.json({
        allWork,
        success: true
    })
}