import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

   const allWork = await prisma.work.findMany({
    where:{
        userId:getUser.id
    },
    omit:{
        userId:true,
    }
   })

   if(!allWork){
    return NextResponse.json({
        success:true,
    msg:"Work not exists"
    } , {status:201})
   }
   return NextResponse.json({
    success:true,
    allWork
   })
}

