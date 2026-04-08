import axios from "axios";

export const getUserCoordinates = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err)
    );
  });
};

export const getRoadDistance = async (userLat: number, userLng: number, targetLat: number, targetLng: number) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${targetLng},${targetLat}?overview=false`;
    const res = await axios.get(url);

    if (res.data.code === "Ok") {
      const route = res.data.routes[0];
      return {
        distance: (route.distance / 1000).toFixed(1) + " km",
        duration: Math.round(route.duration / 60) + " mins", 
      };
    }
    return { distance: "N/A", duration: "N/A" };
  } catch (error) {
    console.error("Distance Calculation Error:", error);
    return { distance: "N/A", duration: "N/A" };
  }
};