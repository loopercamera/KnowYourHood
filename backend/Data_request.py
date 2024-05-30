import requests
import json
import pandas as pd
import geojson
from shapely.geometry import LineString
from shapely.ops import transform
import pyproj

def Overpass_Query(bbox):
    # Overpass API endpoint
    url = "http://overpass-api.de/api/interpreter"

    # Extract bounding box coordinates
    south, west, north, east = bbox

    # Query for the Overpass API with the bounding box
    query = f"""
    [out:json];
    (
    way
        ["highway"]
        ["name"]
        ({south},{west},{north},{east});
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
        with open('backend/data/temp_overpass.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("Data successfully downloaded and saved.")
    else:
        print(f"Error with the request: {response.status_code}")
        print(response.text)

def Clean_Up_Data():
    with open('backend/data/temp_overpass.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Knoten (nodes) und Wege (ways) extrahieren
    nodes = {node['id']: (node['lon'], node['lat']) for node in data['elements'] if node['type'] == 'node'}
    ways = [way for way in data['elements'] if way['type'] == 'way']

    # Projection transformation: WGS84 to UTM
    project = pyproj.Transformer.from_proj(
        pyproj.Proj(init='epsg:4326'),  # source coordinate system
        pyproj.Proj(proj='utm', zone=33, ellps='WGS84')  # destination coordinate system
    ).transform

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

        # Calculate length of the way
        line = LineString(geometry)
        length = transform(project, line).length

        rows.append({
            'way_id': way_id,
            'name': way_name,
            'highway': highway,
            'hgv': hgv,
            'surface': surface,
            'geometry': geometry,
            'length': length
        })

    df = pd.DataFrame(rows, columns=['way_id', 'name', 'highway', 'hgv', 'surface', 'geometry', 'length'])
    df = df[df['highway'] != 'platform']

    return df

# Example usage
bbox = (47.241, 8.452, 47.249, 8.471)
Overpass_Query(bbox)
df = Clean_Up_Data()
print(df)