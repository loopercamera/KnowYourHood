import './GamePage.css';
import React from 'react';
import GameMap from './GameMap.js';
import { useNavigate } from 'react-router-dom';

function GamePage({ centerCoordinate, setMapInstance }) {
  const navigate = useNavigate();

  return (
    <div className="GamePage">
      <div style = {{ display: 'flex' }}>
        <GameMap 
          style = {{ width: '500px', height: '500px' }}
          centerCoordinate={centerCoordinate}
          setMapInstance={setMapInstance}/>
        <div style = {{ display: 'flow'}}>
          <button onClick = {() => navigate('/')}>
            back
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
