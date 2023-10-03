import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server";
import "../App.css";

const LocationTracker = () => {
  const [locations, setLocations] = useState([]);
  const [path, setPath] = useState(null);
  const [userInput, setUserInput] = useState([
    { name: "Home", latitude: "9.4536911", longitude: "77.8090363" },
    { name: "Bus Stop", latitude: "9.45511705", longitude: "77.8015092" },
    { name: "Church", latitude: "9.4503574", longitude: "77.7990665" },
    { name: "School", latitude: "9.4492444", longitude: "77.7882269" },
  ]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    setUserInput((prevUserInput) => {
      const updatedInputs = [...prevUserInput];
      updatedInputs[index][name] = value;
      return updatedInputs;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newLocations = userInput.map(({ name, latitude, longitude }) => ({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    }));
    setLocations(newLocations);
  };

  useEffect(() => {
    // Create a Leaflet map
    if (locations.length > 0) {
      const map = L.map("map").setView(
        [locations[0].latitude, locations[0].longitude],
        13
      );

      // Add a tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Create a Polyline to connect the locations 1 and 2 (Red)
      const pathCoords1 = locations
        .slice(0, 2)
        .map((loc) => [loc.latitude, loc.longitude]);
      const polyline1 = L.polyline(pathCoords1, { color: "red" }).addTo(map);

      // Create a Polyline to connect the locations 2 and 3 (Blue)
      const pathCoords2 = locations
        .slice(1, 3)
        .map((loc) => [loc.latitude, loc.longitude]);
      const polyline2 = L.polyline(pathCoords2, { color: "blue" }).addTo(map);

      // Create a Polyline to connect the locations 3 and 4 (Green)
      const pathCoords3 = locations
        .slice(2)
        .map((loc) => [loc.latitude, loc.longitude]);
      const polyline3 = L.polyline(pathCoords3, { color: "green" }).addTo(map);

      // Add markers for the locations with custom location icon
      locations.forEach((loc, index) => {
        const iconHtml = ReactDOMServer.renderToString(<LocationOnIcon />);
        L.marker([loc.latitude, loc.longitude], {
          icon: L.divIcon({
            className: "custom-marker",
            iconSize: [30, 30],
            html: `<div>${iconHtml}</div>`,
          }),
        })
          .addTo(map)
          .bindPopup(` ${loc.name}`)
          .openPopup();
      });
    }
  }, [locations]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <form onSubmit={handleFormSubmit}>
        {userInput.map((input, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", padding: "10px" }}
          >
            <label>
              Latitude {index + 1}:
              <input
                type="number"
                name="latitude"
                value={input.latitude}
                onChange={(e) => handleInputChange(index, e)}
                step="any"
                required
              />
            </label>
            <label>
              Longitude {index + 1}:
              <input
                type="number"
                name="longitude"
                value={input.longitude}
                onChange={(e) => handleInputChange(index, e)}
                step="any"
                required
              />
            </label>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button type="submit">Show Locations</button>
        </div>
      </form>
      <div>
        {/* {locations.length > 0 ? (
          <div>
            {locations.map((loc, index) => (
              <div key={index}>
                <p>
                  Location {index + 1} ({loc.name}): Latitude: {loc.latitude},
                  Longitude: {loc.longitude}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>
            Enter latitude and longitude for two locations to show on the map.
          </p>
        )} */}
        <div id="map" style={{ height: "500px", width: "500px" }}></div>
      </div>
    </div>
  );
};

export default LocationTracker;
