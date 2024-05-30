import React, { useRef, useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const SelectDataFrameMap = ({ centerCoordinate, setMapInstance, style }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: centerCoordinate,
        zoom: 9,
      }),
      controls: [],
    });

    setMapInstance(mapInstance.current);

    return () => {
      mapInstance.current.setTarget(null);
    };
  }, [centerCoordinate, setMapInstance]);

  return (
    <div ref={mapRef} style={style} />
  );
};

export default SelectDataFrameMap;
