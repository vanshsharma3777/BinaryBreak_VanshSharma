import getLatitudeLongitude  from "./getLatitudeLongitude"
import prisma from "./prisma"

export async function getDistanceBetweenAddresses(
  address1: string,
  address2: string
) {
  const loc1 = await getLatitudeLongitude(address1)
  const loc2 = await getLatitudeLongitude(address2)
  if (loc1 &&  loc2){
   const  distance = haversineDistance(
    loc1.lat,
    loc1.lng,
    loc2.lat,
    loc2.lng
  )
  return Number(distance)
  }
}
