import "./MainPage.css";
import React, {useState} from "react";
import SelectDataFrameMap from "./SelectDataFrameMap";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.js";
import CircularProgress from '@mui/material/CircularProgress';

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
  const [isFetching, setIsFetching] = useState(false);

  const handleFetch = () => {
    const coord = centerBoxCoordinate;

    const squareDist = 1000;
    const x1 = coord[0] - squareDist;
    const y1 = coord[1] - squareDist;
    const x2 = coord[0] + squareDist;
    const y2 = coord[1] + squareDist;

    setBorderBox([x1, y1, x2, y2]);
    setIsFetching(true);

    console.log("x1: ", x1, "y1: ", y1, "x2: ", x2, "y2: ", y2);
    const url = `http://127.0.0.1:8000/OSM-streets/?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          navigate("/play");
          setIsFetching(false);
        }, 1000);
        
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsFetching(false);
      });
  };

  return (
    <div className="MainPage">
      {isFetching && 
      <div className="overlay">
        <CircularProgress  size={500} sx={{color:"#558800"}}/>
      </div>}
      <div style={{ display: "flex", paddingTop: "27px" }}>
        <SelectDataFrameMap
          style={{ width: "500px", height: "500px" }}
          centerCoordinate={centerCoordinate}
          setMapInstance={setMapInstance}
          setCenterBoxCoordinate={setCenterBoxCoordinate}
        />
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '500px', marginLeft: "20px" }}>
          <SearchBar
            setCenterCoordinate={setCenterCoordinate}
            map={mapInstance}
          />
          <div style={{ alignSelf: 'flex-start' }}>
            <button onClick={handleFetch}>Fetch Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
