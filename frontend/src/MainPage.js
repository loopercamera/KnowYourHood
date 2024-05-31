import "./MainPage.css";
import React, { useEffect } from "react";
import SelectDataFrameMap from "./SelectDataFrameMap";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.js";

function MainPage({
  centerCoordinate,
  setCenterCoordinate,
  mapInstance,
  setMapInstance,
  centerBoxCoordinate,
  setCenterBoxCoordinate,
  setBorderBox,
  borderBox
}) {
  const navigate = useNavigate();

  const handleFetch = () => {
    const coord = centerBoxCoordinate;

    const squareDist = 1000;
    const x1 = coord[0] - squareDist;
    const y1 = coord[1] - squareDist;
    const x2 = coord[0] + squareDist;
    const y2 = coord[1] + squareDist;

    setBorderBox([x1, y1, x2, y2]);

    console.log("x1: ", x1, "y1: ", y1, "x2: ", x2, "y2: ", y2);
    const url = `http://127.0.0.1:8000/OSM-streets/?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assuming response is JSON, adjust if necessary
      })
      .then((data) => {
        // Handle the data as needed
        console.log(data);
        // If the response is satisfactory, you can proceed with further actions
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    navigate("/play");
    console.log(centerBoxCoordinate);
  };

  return (
    <div className="MainPage">
      <div style={{ display: "flex" }}>
        <SelectDataFrameMap
          style={{ width: "500px", height: "500px" }}
          centerCoordinate={centerCoordinate}
          setMapInstance={setMapInstance}
          setCenterBoxCoordinate={setCenterBoxCoordinate}
        />
        <div style={{ display: "flow" }}>
          <SearchBar
            setCenterCoordinate={setCenterCoordinate}
            map={mapInstance}
          />
          <button onClick={handleFetch}>Fetch Data</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
