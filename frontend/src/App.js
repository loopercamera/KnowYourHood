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

  return (
    <Router>
      <h1>KnowYourHood</h1>
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
            />
          }
        />
        <Route path="/test" element={<RunScriptButton />} />
      </Routes>
    </Router>
  );
}

export default App;
