import React, { useRef, useEffect } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Vector as VectorLayer } from "ol/layer";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import MultiPoint from "ol/geom/MultiPoint.js";
import Projection from "ol/proj/Projection";

const SelectDataFrameMap = ({ centerCoordinate, setMapInstance, style }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const styles = [
      new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: "orange",
          }),
        }),
        geometry: function (feature) {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
    ];

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
                [47, 8],
                [47, 9],
                [48, 9],
                [48, 8],
                [47, 8],
              ],
            ],
          },
        },
      ],
    };

    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });

    const vectorLayer = new VectorLayer({
      source: source,
      style: styles,
      zIndex: 1, // Set zIndex directly in the layer options
    });

    const osmLayer = new TileLayer({
      source: new OSM(),
      zIndex: 0, // Set zIndex directly in the layer options
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [osmLayer, vectorLayer], // OSM layer first, then vector layer
      view: new View({
        center: centerCoordinate,
        zoom: 9,
      }),
      projection: new Projection({
        code: "EPSG:3857",
        units: "m",
      }),
      controls: [],
    });

    setMapInstance(mapInstance.current);

    return () => {
      mapInstance.current.setTarget(null);
    };
  }, [centerCoordinate, setMapInstance]);

  return <div ref={mapRef} style={style} />;
};

export default SelectDataFrameMap;
