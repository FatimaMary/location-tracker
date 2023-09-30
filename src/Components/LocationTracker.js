import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationTracker = () => {
  const [locations, setLocations] = useState([]);
  const [path, setPath] = useState(null);
  const [userInput, setUserInput] = useState([
    { latitude: "", longitude: "" },
    { latitude: "", longitude: "" },
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
    const newLocations = userInput.map(({ latitude, longitude }) => ({
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

      // Add markers for the locations
      locations.forEach((loc, index) => {
        L.marker([loc.latitude, loc.longitude])
          .addTo(map)
          .bindPopup(`Location ${index + 1}`)
          .openPopup();
      });

      // Create a Polyline to connect the locations
      const pathCoords = locations.map((loc) => [loc.latitude, loc.longitude]);
      const polyline = L.polyline(pathCoords, { color: "blue" }).addTo(map);
      setPath(polyline);
    }
  }, [locations]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <form onSubmit={handleFormSubmit}>
        {userInput.map((input, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "20px", padding: "10px" }}
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
        {locations.length > 0 ? (
          <div>
            {locations.map((loc, index) => (
              <div key={index}>
                <p>
                  Location {index + 1}: Latitude: {loc.latitude}, Longitude:{" "}
                  {loc.longitude}
                </p>
              </div>
            ))}
            <div id="map" style={{ height: "400px", width: "500px" }}></div>
          </div>
        ) : (
          <p>
            Enter latitude and longitude for two locations to show on the map.
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;
