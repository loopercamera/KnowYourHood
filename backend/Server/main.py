from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from Data_request import Clean_Up_Data, Dataframe_to_json, Overpass_Query

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Replace with the origin of your React app
    "http://127.0.0.1",
    "http://127.0.0.1:3000",   # Replace with the origin of your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
@app.get("/OSM-streets/")
async def root(x1: float, y1: float, x2: float, y2: float):
    bbox_3857 = (y1, x1, y2, x2)  # Adjust the order if necessary
    Overpass_Query(*bbox_3857)
    df = Clean_Up_Data()
    Dataframe_to_json(df)

    return {"fertig": "Daten wurden erfolgreich in street_data.json gespeichert"}
