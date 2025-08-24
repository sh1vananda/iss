// src/useAstros.js

import { useState, useEffect } from "react";

export function useAstros() {
  const [people, setPeople] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAstros = async () => {
    try {
        const url = "http://api.open-notify.org/astros.json";
        const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url) + "&disableCache=true";

        const res = await fetch(proxyUrl);
        const rawData = await res.json();
        const data = JSON.parse(rawData.contents);

      if (data.message === "success") {
        setPeople(data.number);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch astronauts data:", err);
    }
  };

  useEffect(() => {
    fetchAstros();
    const interval = setInterval(fetchAstros, 60000);
    return () => clearInterval(interval);
  }, []);

  return { people, loading };
}
