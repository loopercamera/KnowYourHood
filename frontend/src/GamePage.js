// GamePage.js
import './GamePage.css';
import React, { useState } from 'react';
import GameMap from './GameMap.js';
import { useNavigate } from 'react-router-dom';

function StreetList({ streets, doneStreetList }) {
  const itemsPerColumn = 20;

  const splitIntoColumns = (arr, size) => {
    return arr.reduce((columns, item, index) => {
      const columnIndex = Math.floor(index / size);
      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }
      columns[columnIndex].push(item);
      return columns;
    }, []);
  };

  const isStreetDone = (street) => {
    return doneStreetList.includes(street);
  };

  const columns = splitIntoColumns(streets, itemsPerColumn);

  return (
    <div className="street-list">
      {columns.map((column, index) => (
        <div key={index} style={{ float: 'left', marginRight: '20px' }}>
          <table>
            <tbody>
              {column.map((street, i) => (
                <tr key={i}>
                  <td className={isStreetDone(street) ? 'done-street' : ''}>{street}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function GamePage({ centerCoordinate, setMapInstance, centerBoxCoordinate, setCenterBoxCoordinate, borderBox }) {
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState(false);
  const [startStreetList, setStartStreetList] = useState([]);
  const [doneStreetList, setDoneStreetList] = useState([]);
  const [askedStreet, setAskedStreet] = useState();
  const [falseTry, setFalseTry] = useState([]);
  const [negativeScore, setNegativeScore] = useState(0);

  // Generiere die Liste der Strassennamen in alphabetischer Reihenfolge
  const generateStreetList = () => {
    const sortedStreets = [...startStreetList].sort();
    return sortedStreets;
  };

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
      setNegativeScore(prevScore => prevScore + 1);
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
      <div style = {{ display: 'flow' }}>
        <div style = {{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <div>Where is "{askedStreet}" located?</div>
          <div>Negative Score: {negativeScore}</div>
        </div>
        <GameMap className="GameMap"
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
          centerBoxCoordinate={centerBoxCoordinate}
          borderBox={borderBox}/>
        <div style = {{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
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
        </div>
      </div>
      <StreetList doneStreetList={doneStreetList} streets={generateStreetList()} />
    </div>
  );
}

export default GamePage;