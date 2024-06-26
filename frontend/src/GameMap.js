import React, { useRef, useEffect } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Select, DragPan, MouseWheelZoom } from "ol/interaction";
import XYZ from "ol/source/XYZ.js";

import geoJsonData from "./data/street_data.json";

const GameMap = ({
  centerCoordinate,
  setMapInstance,
  fetchData,
  setFetchData,
  startStreetList,
  setStartStreetList,
  askedStreet,
  setAskedStreet,
  doneStreetList,
  setDoneStreetList,
  falseTry,
  setFalseTry,
  centerBoxCoordinate,
  negativeScore,
  setNegativeScore,
  borderBox,
  style,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Funktion die alle Strassennamen extrahiert
  const extractNamesFromFeatures = (features) => {
    return features
      .map((feature) => feature.get("name"))
      .filter((name) => name !== undefined);
  };

  useEffect(() => {
    // Definiert den Import der Strassendaten in die Karte
    const geoJsonSource = new VectorSource({
      features: new GeoJSON({
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }).readFeatures(geoJsonData),
    });

    // Definiert den Strassenlayer
    const StreetLayer = new VectorLayer({
      source: geoJsonSource,
      style: function (feature) {
        const featureName = feature.get("name");
        if (featureName && doneStreetList.includes(featureName)) {
          // Wenn der Name in doneStreetList enthalten ist, grüne Linien
          return new Style({
            stroke: new Stroke({
              color: "#558800", //grün
              width: 3,
            }),
          });
        }
        if (featureName && falseTry.includes(featureName)) {
          // Wenn der Name in falseTry enthalten ist, grüne Linien
          return new Style({
            stroke: new Stroke({
              color: "#CC3333", //rot
              width: 3,
            }),
          });
        } else {
          // Wenn der Name nicht in doneStreetList enthalten ist, rote Linien
          return new Style({
            stroke: new Stroke({
              color: "#3388CC", //blau
              width: 3,
            }),
          });
        }
      },
    });

    const key = "jKNXozwbk19J7hN8HWqH";

    // Inhalte der Karte
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url:
              "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=" +
              key,
            tileSize: 512,
            maxZoom: 20,
          }),
        }),

        StreetLayer,
      ],
      view: new View({
        center: centerBoxCoordinate,
        zoom: 15,
        minZoom: 15,
        extent: borderBox,
      }),
      controls: [],
      interactions: [new Select(), new DragPan(), new MouseWheelZoom()],
    });

    // Eventlistener der prüft, wo man hovert und entsprechend die Linien einfärbt
    const handlePointerMove = (event) => {
      // Prüfen, ob sich der Mauszeiger über einem Feature befindet
      const pixel = mapInstance.current.getEventPixel(event.originalEvent);
      const feature = mapInstance.current.forEachFeatureAtPixel(pixel, (feature) => {
        return feature;
      });
    
      // Setze den Mauszeigerstil entsprechend
      if (feature) {
        mapRef.current.style.cursor = 'pointer'; // Ändere den Mauszeigerstil
        StreetLayer.getSource().getFeatures().forEach((feature) => {
          feature.setStyle(null);
        });
        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 5,
            }),
          })
        );
      } else {
        mapRef.current.style.cursor = 'default'; // Setze den Standardmauszeigerstil zurück
        StreetLayer.getSource().getFeatures().forEach((feature) => {
          feature.setStyle(null);
        });
      }
    };    

    // Eventlistener der die Properties eines Features abfragt
    const handleClick = (event) => {
      // Funktion um nächste Strasse zu erfragen
      const handleNextStreet = () => {
        if (startStreetList.length > 0) {
          // Move the first street to the end of the list
          const [firstStreet, ...restStreets] = startStreetList;
          setStartStreetList([...restStreets, firstStreet]);
          // Set the new first street as askedStreet
          setAskedStreet(restStreets[0]);
        }
      };

      // Prüfen ob am geklickten Ort ein Feature ist
      const pixel = mapInstance.current.getEventPixel(event.originalEvent);
      const feature = mapInstance.current.forEachFeatureAtPixel(
        pixel,
        (feature) => {
          return feature;
        }
      );
      if (feature) {
        // Hier ergänzen was passiert, wenn man auf eine Linie klickt
        const featureName = feature.get("name");
        const featureStyle = feature.getStyle();

        if (
          featureName === askedStreet &&
          featureStyle &&
          featureStyle.getStroke().getColor() === "blue"
        ) {
          setFalseTry([]);

          // Aktualisiere startStreetList und doneStreetList
          setStartStreetList((prevList) =>
            prevList.filter((name) => name !== askedStreet)
          );
          setDoneStreetList((prevList) => [...prevList, askedStreet]);
          handleNextStreet();
        } else {
          setFalseTry((prevList) => [...prevList, featureName]);

          // Wenn der Name weder in doneStreetList noch in falseTry ist, erhöhe negativeScore
          if (
            !doneStreetList.includes(featureName) &&
            !falseTry.includes(featureName)
          ) {
            setNegativeScore((prevScore) => prevScore + 1);
          }
        }
      }
    };

    mapInstance.current.on("pointermove", handlePointerMove);
    mapInstance.current.on("click", handleClick);

    return () => {
      mapInstance.current.un("pointermove", handlePointerMove);
      mapInstance.current.un("click", handleClick);
      mapInstance.current.setTarget(null);
    };
  }, [
    centerCoordinate,
    centerBoxCoordinate,
    fetchData,
    setFetchData,
    askedStreet,
    setAskedStreet,
    setDoneStreetList,
    startStreetList,
    setStartStreetList,
    doneStreetList,
    falseTry,
    setFalseTry,
    setNegativeScore,
  ]);

  useEffect(() => {
    setMapInstance(mapInstance.current);
  }, [setMapInstance]);

  useEffect(() => {
    if (fetchData) {
      // Load data from JSON file
      const geoJsonSource = new VectorSource({
        features: new GeoJSON({
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }).readFeatures(geoJsonData),
      });

      // Extract street names and set the start street list
      const names = extractNamesFromFeatures(geoJsonSource.getFeatures());
      setStartStreetList(names);

      // Set the first street as askedStreet if the names array is not empty
      if (names.length > 0) {
        setAskedStreet(names[0]);
      }

      // Set fetchData back to false to prevent reloading data
      setFetchData(false);
    }
  }, [fetchData, setFetchData, setStartStreetList, setAskedStreet]);

  return <div ref={mapRef} style={style} />;
};

export default GameMap;
