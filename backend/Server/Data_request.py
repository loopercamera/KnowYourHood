import sys
import requests
import json
import pandas as pd
import geojson
from shapely.geometry import LineString, MultiLineString
import pyproj
import os

def Transform_3857_to_4326(bbox_3857):
    proj3857 = pyproj.Transformer.from_crs('epsg:3857', 'epsg:4326', always_xy=True)
    min_lon, min_lat = proj3857.transform(bbox_3857[0], bbox_3857[1])
    max_lon, max_lat = proj3857.transform(bbox_3857[2], bbox_3857[3])
    return (min_lon, min_lat, max_lon, max_lat)

def Overpass_Query(min_lon, min_lat, max_lon, max_lat):
    url = "http://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    (
    way
        ["highway"]
        ["name"]
        ({min_lat},{min_lon},{max_lat},{max_lon});
    >;
    );
    out body;
    """
    response = requests.get(url, params={'data': query})
    if response.status_code == 200:
        data = response.json()
        with open('temp_overpass.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("Data successfully downloaded and saved.")
    else:
        print(f"Error with the request: {response.status_code}")
        print(response.text)
        raise Exception(f"Overpass API request failed with status code {response.status_code}")

def Clean_Up_Data():
    if not os.path.exists('temp_overpass.json'):
        raise FileNotFoundError("temp_overpass.json not found. The Overpass query may have failed.")

    with open('temp_overpass.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    nodes = {node['id']: (node['lon'], node['lat']) for node in data['elements'] if node['type'] == 'node'}
    ways = [way for way in data['elements'] if way['type'] == 'way']

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

    df = pd.DataFrame(rows, columns=['way_id', 'name', 'highway', 'hgv', 'surface', 'geometry'])
    df = df[df['highway'] != 'platform']

    os.remove("temp_overpass.json")
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
    output_path = os.path.join('..','..','frontend', 'src', 'data', 'street_data.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        geojson.dump(feature_collection, f, ensure_ascii=False, indent=4)
    print(f"Data successfully written to {output_path}")

if __name__ == "__main__":
    bbox_3857 = (949784.4685478611, 6002409.281270206, 951784.4685478611, 6004409.281270206)
    min_lon, min_lat, max_lon, max_lat = Transform_3857_to_4326(bbox_3857)
    Overpass_Query(min_lon, min_lat, max_lon, max_lat)
    df = Clean_Up_Data()
    Dataframe_to_json(df)
