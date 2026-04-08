import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth()
    if(!session){
         return NextResponse.json({
                    error: "Unauthorised",
                    success: false
                }, { status: 401 })
    }

    const isPersonExists = await prisma.user.findUnique({
        where:{
            email: session.user?.email!
        }
    })

    if(!isPersonExists){
         return NextResponse.json({
            error: "User not found. Signin again",
            success: false
        }, { status: 402 })
    }

    const isWorkerExists = await prisma.myWorker.findUnique({
        where:{
            userId: isPersonExists.id
        }
    })

    if(!isWorkerExists){
        return NextResponse.json({
            error: "Create worker's profile first",
            success: false
        },{status:402})
    }

    const allWork = await prisma.work.findMany({
        where:{
            isActive:true
        },omit:{
            id:true,
            userId:true
        },include:{
            user:{
                omit:{
                    id:true,
                    userId:true
                }
            }
        }
    })

    if(!allWork){
        return NextResponse.json({
            msg: "No active work",
            success: true
        }, { status:201})
    }


    return NextResponse.json({
            allWork,
            success: true
        })
}