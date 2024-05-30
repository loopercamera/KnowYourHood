import React, { useRef, useEffect } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import { Stroke, Style } from "ol/style.js";
import { fromLonLat, toLonLat } from "ol/proj";

const SelectDataFrameMap = ({ centerCoordinate, setMapInstance, style }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorLayer = useRef(null);

  useEffect(() => {
    console.log(centerCoordinate);
    const osmLayer = new TileLayer({
      source: new OSM(),
      zIndex: 0,
    });

    vectorLayer.current = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
        }),
      }),
      zIndex: 1,
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [osmLayer, vectorLayer.current],
      view: new View({
        center: centerCoordinate,
        zoom: 15,
      }),
      controls: [],
    });

    setMapInstance(mapInstance.current);

    const updatePolygon = () => {
      const view = mapInstance.current.getView();
      const centerCoordinate = view.getCenter();
      console.log(centerCoordinate);
      const lonLat = toLonLat(centerCoordinate);
      const [lon, lat] = lonLat;
      console.log(lon, lat);

      const coords3857 = fromLonLat([lon, lat]);
      const squareDist = 1000; // 1 km

      const geojsonObject = {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: {
            name: "EPSG:3857",
          },
        },
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [coords3857[0] - squareDist, coords3857[1] - squareDist],
                  [coords3857[0] + squareDist, coords3857[1] - squareDist],
                  [coords3857[0] + squareDist, coords3857[1] + squareDist],
                  [coords3857[0] - squareDist, coords3857[1] + squareDist],
                  [coords3857[0] - squareDist, coords3857[1] - squareDist],
                ],
              ],
            },
          },
        ],
      };

      const vectorSource = vectorLayer.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(new GeoJSON().readFeatures(geojsonObject));
    };

    mapInstance.current.on("change:center", updatePolygon);

    return () => {
      mapInstance.current.un("change:center", updatePolygon);
      mapInstance.current.setTarget(null);
    };
  }, [centerCoordinate, setMapInstance]);

  return <div ref={mapRef} style={style} />;
};

export default SelectDataFrameMap;
