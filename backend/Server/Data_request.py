import sys
import requests
import json
import pandas as pd
import geojson
from shapely.geometry import LineString, MultiLineString
from shapely.ops import transform
import pyproj
import os


def Transform_3857_to_4326(bbox_3857):
    # Define the projection objects for EPSG 3857 and EPSG 4326
    proj3857 = pyproj.Proj(init='epsg:3857')
    proj4326 = pyproj.Proj(init='epsg:4326')
    
    # Transform the bounding box coordinates
    min_lon, min_lat = pyproj.transform(proj3857, proj4326, bbox_3857[0], bbox_3857[1])
    max_lon, max_lat = pyproj.transform(proj3857, proj4326, bbox_3857[2], bbox_3857[3])
    
    # Return the transformed bounding box
    return (min_lon, min_lat, max_lon, max_lat)

def Overpass_Query(min_lon, min_lat, max_lon, max_lat):
    # Overpass API endpoint
    url = "http://overpass-api.de/api/interpreter"


    # Query for the Overpass API with the bounding box
    query = f"""
    [out:json];
    (
    way
        ["highway"]
        ["name"]
        ({min_lon},{min_lat},{max_lon},{max_lat});
    >;
    );
    out body;
    """

    # Send request to the Overpass API
    response = requests.get(url, params={'data': query})

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        # Save JSON data
        with open('temp_overpass.json', 'w', encoding='utf-8') as f:  # Updated path
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("Data successfully downloaded and saved.")
    else:
        print(f"Error with the request: {response.status_code}")
        print(response.text)

def Clean_Up_Data():
    with open('temp_overpass.json', 'r', encoding='utf-8') as f:  # Updated path
        data = json.load(f)

    # Knoten (nodes) und Wege (ways) extrahieren
    nodes = {node['id']: (node['lon'], node['lat']) for node in data['elements'] if node['type'] == 'node'}
    ways = [way for way in data['elements'] if way['type'] == 'way']

    # Daten in ein Pandas DataFrame umwandeln
    rows = []
    for way in ways:
        way_id = way['id']
        way_tags = way['tags']
        way_name = way_tags.get('name', 'N/A')
        highway = way_tags.get('highway', 'N/A')
        hgv = way_tags.get('hgv', 'N/A')
        surface = way_tags.get('surface', 'N/A')
        geometry = [nodes[node_id] for node_id in way['nodes']]

        rows.append({
            'way_id': way_id,
            'name': way_name,
            'highway': highway,
            'hgv': hgv,
            'surface': surface,
            'geometry': geometry,
        })

    df = pd.DataFrame(rows, columns=['way_id', 'name', 'highway', 'hgv', 'surface', 'geometry', 'length'])
    df = df[df['highway'] != 'platform']

    os.remove("temp_overpass.json")  # Updated path

    return df

def Dataframe_to_json(df):
    from shapely.geometry import mapping, LineString, MultiLineString

    grouped = df.groupby('name').agg({
        'geometry': list,
        'highway': 'first',
        'hgv': 'first',
        'surface': 'first'
    }).reset_index()

    features = []
    for _, row in grouped.iterrows():
        name = row['name']
        highway = row['highway']
        hgv = row['hgv']
        surface = row['surface']
        geometries = [LineString(geom) for geom in row['geometry']]
        multi_line = MultiLineString(geometries)

        feature = geojson.Feature(
            geometry=mapping(multi_line),
            properties={
                'name': name,
                'highway': highway,
                'hgv': hgv,
                'surface': surface,
            }
        )
        features.append(feature)

    feature_collection = geojson.FeatureCollection(features)
    with open('street_data.json', 'w', encoding='utf-8') as f:  # Updated path
        geojson.dump(feature_collection, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    # if len(sys.argv) != 5:
    #     print("Usage: python your_script.py <south> <west> <north> <east>")
    # else:
    #bbox = (float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]))
    bbox_3857 = (949784.4685478611,6002409.281270206,951784.4685478611,6004409.281270206)
    min_lon, min_lat, max_lon, max_lat = Transform_3857_to_4326(bbox_3857)
    Overpass_Query(min_lon, min_lat, max_lon, max_lat)
    df = Clean_Up_Data()
    Dataframe_to_json(df)
    # Optional: copy street_data.json to frontend folder
