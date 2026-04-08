import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { all } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await sessionDeatils()
    if (!session) {
        return NextResponse.json({ error: "Unauthorised", success: false }, { status: 401 });
    }
        const person = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });
    if (!person) {
        return NextResponse.json({ error: "User not found. Create your profile first", success: false }, { status: 404 });
    }

    const userDetails = await prisma.myUser.findUnique({
        where: { role: "user", userId: person.id },
        omit: {
            id: true,
            userId: true
        }
    })
    if (!userDetails) {
        return NextResponse.json({
            success: false,
            error: `User not found. create profile first`
        }, { status: 201 })
    }

        let allWorker = null
        if (userDetails) {
            allWorker = await prisma.myWorker.findMany({
                where: { role: "worker" },
                omit: {
                    userId: true
                }
            })
        }
        if (!allWorker) {
            return NextResponse.json({
                success: false,
                error: `No worker found`
            }, { status: 201 })
        }
    
                let allVendor = null
        if (userDetails) {
            allVendor = await prisma.myVendor.findMany({
                where: { role: "vendor" },
                omit: {
                    userId: true
                }
            })
        }
        if (!allVendor) {
            return NextResponse.json({
                success: false,
                error: `No vendor found`
            }, { status: 201 })
        }
        return NextResponse.json({
            success: true,
            allVendor,
            allWorker
        })
    
}