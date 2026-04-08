'use client'

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Dahboard(){
    const router = useRouter()
    const { role } = useParams<{role : string}>();
    console.log(role)
    if(role==='user'){
        router.replace('/user/profile')
    } else if(role ==='vendor'){
        router.replace('/vendor/profile')
    }
    else if( role ==='worker'){ 
        router.replace('/worker/profile')
    }
    return null
}