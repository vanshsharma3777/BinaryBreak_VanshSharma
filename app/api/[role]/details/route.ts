import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { tr } from "framer-motion/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils();
    if (!session) {
        return NextResponse.json({ error: "Unauthorised", success: false }, { status: 401 });
    }

    const { role } = await params;
        const normalizedRole = role.toLowerCase().trim();
    const person = await prisma.user.findUnique({
        where: { email: session.user?.email! }
    });

    if (!person) {
        return NextResponse.json({ error: "User not found", success: false }, { status: 404});
    }

    let userDetails = null;

    if (normalizedRole === 'user') {
        userDetails = await prisma.myUser.findUnique({
            where: { userId: person.id },
            select: { name: true, mobileNumber: true, address: true, role: true , lat:true , lng:true  }
        });
        if(!userDetails){
            return NextResponse.json({
                success:false,
                error:"Create profile first"
            }, {status:201} )
        }
    } else if (normalizedRole === 'vendor') {
        userDetails = await prisma.myVendor.findUnique({
            where: { userId: person.id },
            select: { name: true, shopName: true, mobileNumber: true, address: true, role: true, age: true }
        });
        if(!userDetails){
            return NextResponse.json({
                success:false,
                error:"Create profile first"
            }, {status:201})
        }
    } else if (normalizedRole === 'worker') {
        userDetails = await prisma.myWorker.findUnique({
            where: { userId: person.id },
            select: { name: true, mobileNumber: true, occupation: true,address:true , experience:true , hourlyWages:true, dailyWage: true, role: true, age: true , lat:true , lan:true }
        });
        if(!userDetails){
            return NextResponse.json({
                success:true,
                error:"Create profile first"
            }, {status:201})
        }
    }
    console.log(userDetails)
    if (!userDetails) {
        return NextResponse.json({
            success: false,
            msg: `${normalizedRole} profile record missing in database`,
            userDetails: null 
        }); 
    }
    return NextResponse.json({
        success: true,
        msg: normalizedRole,
        userDetails
    });
}