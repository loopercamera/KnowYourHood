from fastapi import FastAPI
from pathlib import Path
from Data_request import Clean_Up_Data, Dataframe_to_json,Overpass_Query
app = FastAPI()


@app.get("/OSM-streets/")
async def root(x1: float, y1: float, x2: float, y2: float):
    bbox = (x1, y1, x2, y2)
    Overpass_Query(bbox)
    df = Clean_Up_Data()
    Dataframe_to_json(df)

    return {"fertig": "Daten wurden erfolgreich in street_data.json gespeichert"}


