import "./MainPage.css";
import React from "react";
import SelectDataFrameMap from "./SelectDataFrameMap";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.js";

function MainPage({
  centerCoordinate,
  setCenterCoordinate,
  mapInstance,
  setMapInstance,
  centerBoxCoordinate,
  setCenterBoxCoordinate
}) {
  const navigate = useNavigate();

  const handleFetch = () => {
    navigate("/play")
    console.log(centerBoxCoordinate)
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
