import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import GamePage from "./GamePage";
import RunScriptButton from "./RunScriptButton";

function App() {
  const [centerCoordinate, setCenterCoordinate] = useState([
    950784.4685478611, 6003409.281270206,
  ]);
  const [mapInstance, setMapInstance] = useState(null);

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
            />
          }
        />
        <Route path="/test" element={<RunScriptButton />} />
      </Routes>
    </Router>
  );
}

export default App;
