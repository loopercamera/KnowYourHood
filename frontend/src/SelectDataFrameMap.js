import React, { useRef, useEffect } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Stroke, Style, Fill } from "ol/style.js";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import Polygon from "ol/geom/Polygon";

const MapComponent = ({
  centerCoordinate,
  style,
  setCenterBoxCoordinate,
  setMapInstance
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorLayer = useRef(null);

  const squareDist = 1000; // 1 km

  const initializeSquare = (centerCoord) => {
    const [lon, lat] = toLonLat(centerCoord);
    const coords3857 = fromLonLat([lon, lat]);

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

    const outerCoordinates = [
      [-20037508.34, -20037508.34],
      [-20037508.34, 20037508.34],
      [20037508.34, 20037508.34],
      [20037508.34, -20037508.34],
      [-20037508.34, -20037508.34],
    ];

    const maskCoordinates = [
      outerCoordinates,
      geojsonObject.features[0].geometry.coordinates[0],
    ];

    const maskFeature = new Feature(new Polygon(maskCoordinates));

    const vectorSource = vectorLayer.current.getSource();
    vectorSource.clear();
    vectorSource.addFeature(maskFeature);

    setCenterBoxCoordinate(centerCoord);
  };

  useEffect(() => {
    vectorLayer.current = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          color: "rgba(0, 0, 0, 0.5)",
        }),
        stroke: new Stroke({
          color: "#3388CC",
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
        maxZoom: 15,
      }),
      controls: [],
    });

    setMapInstance(mapInstance.current);

    const updateCenter = () => {
      const view = mapInstance.current.getView();
      const centerCoord = view.getCenter();
      initializeSquare(centerCoord);
    };

    // Initial square setup
    initializeSquare(centerCoordinate);

    // Add event listener to map's view for 'change:center'
    mapInstance.current.getView().on("change:center", updateCenter);

    return () => {
      // Clean up event listener when component unmounts
      mapInstance.current.getView().un("change:center", updateCenter);
      mapInstance.current.setTarget(null);
    };
  }, [centerCoordinate, setCenterBoxCoordinate, setMapInstance]);

  return <div ref={mapRef} style={style} />;
};

export default MapComponent;
