// src/hooks/useISS.js

import { useState, useEffect } from "react";

export function useISS() {
  const [positions, setPositions] = useState({ prev: [0, 0], current: [0, 0] });
  const [timestamp, setTimestamp] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchISS = async () => {
    try {
      const url = "http://api.open-notify.org/iss-now.json";
      const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url) + "&disableCache=true";

      const res = await fetch(proxyUrl);
      const rawData = await res.json();
      const data = JSON.parse(rawData.contents);

      if (data.message === "success") {
        const lat = parseFloat(data.iss_position.latitude);
        const lng = parseFloat(data.iss_position.longitude);

        setPositions(({ current }) => ({
          prev: current,
          current: [lat, lng],
        }));

        setTimestamp(data.timestamp);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch ISS data:", err);
    }
  };

  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDirection = () => {
    const [prevLat, prevLng] = positions.prev;
    const [currLat, currLng] = positions.current;

    if (prevLat === 0 && prevLng === 0) return null;

    const dLat = currLat - prevLat;
    const dLng = currLng - prevLng;

    return Math.atan2(dLng, dLat) * (180 / Math.PI);
  };

  const direction = getDirection();

  return { positions, timestamp, loading, direction };
}
