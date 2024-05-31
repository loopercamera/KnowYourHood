from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Data_request import Clean_Up_Data, Dataframe_to_json, Overpass_Query, Transform_3857_to_4326

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
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
    try:
        bbox_3857 = (x1, y1, x2, y2)
        min_lon, min_lat, max_lon, max_lat = Transform_3857_to_4326(bbox_3857)
        Overpass_Query(min_lon, min_lat, max_lon, max_lat)
        df = Clean_Up_Data()
        Dataframe_to_json(df)
        return {"status": "Data successfully saved in street_data.json"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

