import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await auth()

    if (!session) {
        return NextResponse.json({ error: "Unauthorised", success: false }, { status: 401 });
    }
    const { role } = await params;
    const normalizedRole = role.toLowerCase().trim()
    console.log("normaliwd roel" , normalizedRole)
    const person = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });
    if (!person) {
        return NextResponse.json({ error: "User not found. Create your profile first", success: false }, { status: 404 });
    }


    if (normalizedRole === 'worker') {
        console.log("hell")
        let allPerson = null
            allPerson = await prisma.myWorker.findMany({
                where: { role: normalizedRole },
                omit: {
                    userId: true
                }
            })
        

        if (!allPerson) {
            return NextResponse.json({
                success: false,
                error: `No ${role} found`
            }, { status: 201 })
        }
        return NextResponse.json({
            success: true,
            allPerson
        })
    }
    else if (normalizedRole === 'vendor') {
        let allPerson = null
            allPerson = await prisma.myVendor.findMany({
                where: { role: normalizedRole },
                omit: {
                    userId: true
                }
            })
        
        if (!allPerson) {
            return NextResponse.json({
                success: false,
                error: `No ${role} found`
            }, { status: 201 })
        }
        return NextResponse.json({
            success: true,
            allPerson
        })
    }
}