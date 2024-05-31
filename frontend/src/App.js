// is centerBoxCoordinate used?

import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import GamePage from "./GamePage";

function App() {
  const [centerCoordinate, setCenterCoordinate] = useState([
    950784.4685478611, 6003409.281270206,
  ]);
  const [mapInstance, setMapInstance] = useState(null);
  const [centerBoxCoordinate, setCenterBoxCoordinate] = useState([
    950784.4685478611, 6003409.281270206,
  ]);
  const [borderBox, setBorderBox] = useState();

  return (
    <Router>
      <div style = {{display: 'flex'}}>
        <h1>KnowYourHood</h1>
        <div>GitHub</div>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              centerCoordinate={centerCoordinate}
              setCenterCoordinate={setCenterCoordinate}
              mapInstance={mapInstance}
              setMapInstance={setMapInstance}
              centerBoxCoordinate={centerBoxCoordinate}
              setCenterBoxCoordinate={setCenterBoxCoordinate}
              borderBox={borderBox}
              setBorderBox={setBorderBox}
            />
          }
        />
        <Route
          path="/play"
          element={
            <GamePage
              centerCoordinate={centerCoordinate}
              setCenterCoordinate={setCenterCoordinate}
              mapInstance={mapInstance}
              setMapInstance={setMapInstance}
              centerBoxCoordinate={centerBoxCoordinate}
              setCenterBoxCoordinate={setCenterBoxCoordinate}
              borderBox={borderBox}
              setBorderBox={setBorderBox}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
