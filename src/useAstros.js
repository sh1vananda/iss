// src/useAstros.js

import { useState, useEffect } from "react";

export function useAstros() {
  const [people, setPeople] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAstros = async () => {
    try {
      const res = await fetch("http://api.open-notify.org/astros.json");
      const data = await res.json();

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
