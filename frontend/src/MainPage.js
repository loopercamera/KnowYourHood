import './MainPage.css';
import React from 'react';
import SelectDataFrameMap from './SelectDataFrameMap';
import { useNavigate } from 'react-router-dom';

function MainPage({ centerCoordinate, setMapInstance }) {
  const navigate = useNavigate();

  return (
    <div className="MainPage">
      <div style = {{ display: 'flex' }}>
        <SelectDataFrameMap 
          style = {{ width: '500px', height: '500px' }}
          centerCoordinate={centerCoordinate}
          setMapInstance={setMapInstance}/>
        <div style = {{ display: 'flow'}}>
          <button onClick = {() => navigate('/play')}>
            Fetch Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
