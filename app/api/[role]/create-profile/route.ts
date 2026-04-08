import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sessionDeatils } from "@/lib/sessionDetails";
import { NextRequest, NextResponse } from "next/server";
import getLatitudeLongitude from '../../../../lib/getLatitudeLongitude'
export async function POST(request: NextRequest, { params }: { params: Promise<{ role: string }> }) {
    const session = await sessionDeatils()

    if (!session) {
        return NextResponse.json({
            error: "Unauthorized (user/profile/create)",
            success: false
        }, { status: 401 })
    }
    const person = await prisma.user.findUnique({
        where: {
            email: session?.user?.email!
        }
    })

    if (!person) {
        return NextResponse.json({
            success: false,
            error: "Person not found Signin again"
        }, { status: 402 })
    }

    const { role: role } = await params
    if (role === 'user') {
        const isPersonExists = await prisma.myUser.findFirst({
            where: {
                userId: person?.id
            }
        })
        if (isPersonExists) {
            return NextResponse.json({
                error: "Profile already created (user/profile/create)",
                success: false
            }, { status: 405 })
        }
        const { name, mobileNumber, address } = await request.json()
        const location = await getLatitudeLongitude(address)
        if (location) {
            console.log('lat', location.lat)
            console.log('lon', location.lng)
        }
        const createdUser = await prisma.myUser.create({
            data: {
                name,
                userId: person?.id!,
                mobileNumber,
                lat:location?.lat,
                lng:location?.lng,
                address,
                role
            },
            select: {
                name: true,
                mobileNumber: true,
                lat:true,
                lng:true,
                address: true,
                role: true
            }
        })

        return NextResponse.json({
            success: true,
            createdUser,
            msg: "User creted successfuly"
        })
    } else if (role === 'vendor') {
        const isvendorExists = await prisma.myVendor.findFirst({
            where: {
                userId: person?.id
            }
        })
        if (isvendorExists) {
            return NextResponse.json({
                error: "Profile already created (vendor/profile/create)",
                success: false
            }, { status: 405 })
        }
        const { name, mobileNumber, address, age, shopName } = await request.json()
        const ageInNumber = Number(age)
        const createdvendor = await prisma.myVendor.create({
                data: {
                    name,
                    userId: person?.id!,
                    mobileNumber,
                    shopName,
                    address,
                    age:ageInNumber,
                    role
                },
                select: {
                    name: true,
                    shopName: true,
                    mobileNumber: true,
                    address: true,
                    role: true,
                    age: true

                }
            })
            return NextResponse.json({
                success: true,
                createdvendor,
                msg: "vendor creted successfuly"
            })
    }
    else if (role === 'worker') {
        const isworkerExists = await prisma.myWorker.findFirst({
            where: {
                userId: person?.id
            }
        })
        if (isworkerExists) {
            return NextResponse.json({
                error: "Profile already created (worker/profile/create)",
                success: false
            }, { status: 405 })
        }
        let { name, mobileNumber, dailyWage , age ,occupation,hourlyWages, experience,address } = await request.json()
        const location = await getLatitudeLongitude(address)
             dailyWage = Number(dailyWage)
             age = Number(age)
             hourlyWages = Number(hourlyWages)
             experience = Number(experience)
            const createdworker = await prisma.myWorker.create({
                data: {
                    name,
                    userId: person?.id!,
                    mobileNumber,
                    occupation,
                    lat: location?.lat,
                    experience,
                    lan: location?.lng,
                    dailyWage,
                    hourlyWages,
                    age,
                    role
                },
                select: {
                    name: true,
                    mobileNumber: true,
                    occupation: true,
                    lat:true,
                    lan:true,
                    experience,
                    hourlyWages,
                    dailyWage: true,
                    age: true,
                    role: true
                }
            })
    
        return NextResponse.json({
            success: true,
            createdworker,
            msg: "worker creted successfuly"
        })
    }
}