// Todo, reihenfolge beim start und restart zufällig definieren

import './GamePage.css';
import React, { useState } from 'react';
import GameMap from './GameMap.js';
import { useNavigate } from 'react-router-dom';

function GamePage({ centerCoordinate, setMapInstance, centerBoxCoordinate, setCenterBoxCoordinate }) {
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState(false);
  const [startStreetList, setStartStreetList] = useState([]);
  const [doneStreetList, setDoneStreetList] = useState([]);
  const [askedStreet, setAskedStreet] = useState();
  const [falseTry, setFalseTry] = useState([]);
  const [negativeScore, setNegativeScore] = useState(0);

  const handleGameStart = () => {
    if (startStreetList.length === 0) {
      // Set fetchData to true to load data from JSON file
      setFetchData(true);
    } else {
      // Set the asked street to the first street in the list
      setAskedStreet(startStreetList[0]);
    }
    // Handle starting the game logic here
  };

  const handleSkipStreet = () => {
    if (startStreetList.length > 0) {
      // Move the first street to the end of the list
      const [firstStreet, ...restStreets] = startStreetList;
      setStartStreetList([...restStreets, firstStreet]);
      
      // Set the new first street as askedStreet
      setAskedStreet(restStreets[0]);
      setFalseTry([]);
    }
  }

  const handleRestart = () => {
    // Move elements from doneStreetList to startStreetList
    setStartStreetList(prevList => [...prevList, ...doneStreetList]);
    // Clear doneStreetList
    setDoneStreetList([]);
    setFalseTry([]);
    setNegativeScore(0);
  };

  return (
    <div className="GamePage">
      <div style = {{ display: 'flex' }}>
        <GameMap 
          style = {{ width: '500px', height: '500px' }}
          centerCoordinate={centerCoordinate}
          setMapInstance={setMapInstance}
          fetchData={fetchData}
          setFetchData={setFetchData}
          startStreetList={startStreetList}
          setStartStreetList={setStartStreetList}
          askedStreet={askedStreet}
          setAskedStreet={setAskedStreet}
          doneStreetList={doneStreetList}
          setDoneStreetList={setDoneStreetList}
          falseTry={falseTry}
          setFalseTry={setFalseTry}
          negativeScore={negativeScore}
          setNegativeScore={setNegativeScore}
          centerBoxCoordinate={centerBoxCoordinate}/>
        <div style = {{ display: 'flow'}}>
          <button onClick = {() => navigate('/')}>
            New map section
          </button>
          <button onClick = {handleGameStart}>
            Start Game
          </button>
          <button onClick = {handleSkipStreet}>
            Skip
          </button>
          <button onClick = {handleRestart}>
            Restart
          </button>
          <div>Wo ist {askedStreet}?</div>
          <div>Anzahl Fehlversuche: {negativeScore}</div>
          <ul style= {{ textAlign: 'left'}}>
            {startStreetList.map((street, index) => (
              <li key={index}>{street}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GamePage;