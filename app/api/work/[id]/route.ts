import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request:NextRequest ,{ params}:{params:Promise<{id:string}>}) {
    const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({
            error:"Unauthorised",
            success:false
        },{status:401})
    }
    
    const isUserExists = await prisma.user.findUnique({
        where:{
            email:session.user?.email!
        }
    })
    if(!isUserExists){
             return NextResponse.json({
            error:"User not found. Signin again",
            success:false
        },{status:402})
    }

    const getUser = await prisma.myUser.findUnique({
        where:{
            userId:isUserExists.id
        }
    })

    if(!getUser){
         return NextResponse.json({
            error:"User Not Found. Signin again.",
            success:false
        },{status:402})
    }
    const { id :id} = await params
    const getWork = await prisma.work.findUnique({
        where:{id:id}
    })
    if(!getWork){
        return NextResponse.json({
            success:false,
            error:"Work not found.Firstly , create the work then mark it as complete"
        },{status:500})
    }
    console.log(getWork)
    const {isActive} = await request.json()
    const markWorkDone = await prisma.work.update({
        where:{
            id:id
        },data:{
            isActive:isActive
        }
    })
    return NextResponse.json({
        success:true,
        msg:"Work mark as completed"
    })
}


export async function GET(request:NextRequest , {params} :{params:Promise <{id:string}>}){
     const session = await sessionDeatils()
    if(!session){
        return NextResponse.json({
            error:"Unauthorised",
            success:false
        },{status:401})
    }
    
    const isUserExists = await prisma.user.findUnique({
        where:{
            email:session.user?.email!
        }
    })
    if(!isUserExists){
             return NextResponse.json({
            error:"User not found. Signin again",
            success:false
        },{status:402})
    }

    const getUser = await prisma.myUser.findUnique({
        where:{
            userId:isUserExists.id
        }
    })

    if(!getUser){
         return NextResponse.json({
            error:"User Not Found. Signin again.",
            success:false
        },{status:402})
    }
    const {id} = await params

    const findWork = await prisma.work.findUnique({
        where:{
            id:id
        },
        omit:{
            userId:true,
            lat:true,
            lng:true,
        }
    })

    console.log(findWork)

    return NextResponse.json({
        success:true,
        findWork
    })
}