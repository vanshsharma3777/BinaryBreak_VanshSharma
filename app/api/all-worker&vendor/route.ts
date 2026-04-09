import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth()

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorised", success: false },
            { status: 401 }
        );
    }

    const person = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });

    if (!person) {
        return NextResponse.json(
            {
                error: "User not found. Create your profile first",
                success: false
            },
            { status: 404 }
        );
    }

    const userDetails = await prisma.myUser.findUnique({
        where: { role: "user", userId: person.id },
        omit: {
            id: true,
            userId: true
        }
    });

    if (!userDetails) {
        return NextResponse.json({
            success: false,
            error: `User not found. create profile first`
        }, { status: 201 });
    }

    // Cache Keys
    const workerCacheKey = "workers:all";
    const vendorCacheKey = "vendors:all";

    // Check cache
    let allWorker = await redis.get(workerCacheKey);
    let allVendor = await redis.get(vendorCacheKey);

    // Workers Cache Miss
    if (!allWorker) {
        console.log("Worker Cache Miss");

        allWorker = await prisma.myWorker.findMany({
            where: { role: "worker" },
            omit: {
                userId: true
            }
        });

        await redis.set(workerCacheKey, allWorker, {
            ex: 120
        });
    } else {
        console.log("Worker Cache Hit");
    }

    // Vendor Cache Miss
    if (!allVendor) {
        console.log("Vendor Cache Miss");

        allVendor = await prisma.myVendor.findMany({
            where: { role: "vendor" },
            omit: {
                userId: true
            }
        });

        await redis.set(vendorCacheKey, allVendor, {
            ex: 120
        });
    } else {
        console.log("Vendor Cache Hit");
    }

    if (!allWorker || !allVendor) {
        return NextResponse.json({
            success: false,
            error: "No workers or vendors found"
        }, { status: 201 });
    }

    return NextResponse.json({
        success: true,
        allVendor,
        allWorker
    });
}