import axios from 'axios';

export default async function getLatitudeLongitude(address: string) {
  if (!address) return null;

  const token = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;
  const url = `https://us1.locationiq.com/v1/search.php`;

  try {
    const response = await axios.get(url, {
      params: {
        key: token,
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      };
    }
    return null;
  } catch (error) {
    console.error("LocationIQ Geocoding Error:", error);
    return null;
  }
}