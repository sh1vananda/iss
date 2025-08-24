// src/App.jsx

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { ArrowUp } from "lucide-react";

import { useISS } from "./useISS";
import { useAstros } from "./useAstros";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const { positions, timestamp, loading: issLoading, direction } = useISS();
  const position = positions.current;

  const { people, loading: astrosLoading } = useAstros();

  return (
    <main className="min-h-screen">
      <div className="p-2 max-w-4xl mx-auto font-sans">
        <h1 className="text-2xl font-bold mb-2 mt-2">🛰️ Live ISS Tracker</h1>

        {issLoading ? (
          <p>Loading ISS position...</p>
        ) : (
          <div className="mb-2">
            <p>
              <strong>Current Position:</strong> {position[0].toFixed(4)}° Lat,{" "}
              {position[1].toFixed(4)}° Lng
            </p>
            <p>
              <strong>Last Update:</strong>{" "}
              {new Date(timestamp * 1000).toLocaleString()}
            </p>
            {direction !== null && (
              <p className="flex items-center gap-2">
                <strong>Direction:</strong> {direction.toFixed(0)}°{" "}
                <ArrowUp
                  className="w-5 h-5 text-blue-500"
                  style={{ transform: `rotate(${direction}deg)` }}
                />
              </p>
            )}
          </div>
        )}

        {!issLoading && (
          <MapContainer
            center={position}
            zoom={3}
            className="h-[70vh] w-full rounded-lg border"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                🛰️ <strong>International Space Station</strong>
                <br />
                Latitude: {position[0].toFixed(4)}
                <br />
                Longitude: {position[1].toFixed(4)}
                <br />
                Altitude: ~400 km (low Earth orbit)
              </Popup>
            </Marker>
          </MapContainer>
        )}

        <footer className="flex justify-between mt-2 text-sm">
          <div>
            {astrosLoading ? (
              "Loading astronauts data..."
            ) : (
              <>🧑‍🚀 There are currently {people} people in space </>
            )}
          </div>
          <div>
            Data from{" "}
            <a
              href="http://open-notify.org"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Open Notify API
            </a>
            . Refreshes every 5 seconds.
          </div>
        </footer>
      </div>
    </main>
  );
}

export default App;
