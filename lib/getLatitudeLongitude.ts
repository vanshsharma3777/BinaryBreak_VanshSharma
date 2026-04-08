const getLatitudeLongitude = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  if (!address || !address.trim()) {
    console.warn("Empty address provided")
    return null
  }
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY
  console.log(apiKey)
  if (!apiKey) {
    throw new Error("MAP_API_KEY is missing in environment variables")
  }

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${apiKey}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("OpenCage API error:", text)
      return null
    }

    const data = await response.json()

    if (!data?.results?.length) {
      console.warn("No results found for address:", address)
      return null
    }

    const { lat, lng } = data.results[0].geometry

    return { lat, lng }
  } catch (error) {
    console.error("Geocoding failed:", error)
    return null
  }
}

export default getLatitudeLongitude
