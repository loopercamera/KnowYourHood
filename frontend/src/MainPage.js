import './MainPage.css';
import React, { useState } from 'react';
import SelectDataFramMap from './SelectDataFrameMap.js';

function MainPage() {
  const [centerCoordinate, setCenterCoordinate] = useState([950784.4685478611, 6003409.281270206]);
  const [mapInstance, setMapInstance] = useState(null);

  return (
    <div className="MainPage">
      <SelectDataFramMap 
      centerCoordinate={centerCoordinate}
      setMapInstance={setMapInstance}/>
    </div>
  );
}

export default MainPage;
