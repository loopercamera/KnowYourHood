import React, { useRef, useEffect } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Stroke, Style } from "ol/style.js";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";

const MapComponent = ({ centerCoordinate, setMapInstance, style }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorLayer = useRef(null);

  useEffect(() => {
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
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer.current,
      ],
      view: new View({
        center: centerCoordinate,
        zoom: 15,
      }),
    });

    const updateCenter = () => {
      const view = mapInstance.current.getView();
      const centerCoordinate = view.getCenter();
      const lonLat = toLonLat(centerCoordinate);
      const [lon, lat] = lonLat;
      const coords3857 = fromLonLat([lon, lat]);
      console.log(coords3857);

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

    // Add event listener to map's view for 'change:center'
    mapInstance.current.getView().on("change:center", updateCenter);

    return () => {
      // Clean up event listener when component unmounts
      mapInstance.current.getView().un("change:center", updateCenter);
      mapInstance.current.setTarget(null);
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
