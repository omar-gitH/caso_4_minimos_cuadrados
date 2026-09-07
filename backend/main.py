from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from math_engine import calculate_least_squares_potential

app = FastAPI(title="Ajuste Alométrico API")

# Configurar CORS para permitir que el frontend local (Vite) consulte la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción se debe restringir a los orígenes correspondientes
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar datos JSON en memoria al iniciar
current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(current_dir, "data.json")

with open(data_path, "r", encoding="utf-8") as f:
    dataset = json.load(f)

@app.get("/api/data")
def get_data():
    """Retorna todo el conjunto de datos."""
    return dataset

@app.get("/api/fit/{cluster_id}")
def get_fit(cluster_id: str):
    """
    Realiza el ajuste potencial para un clúster dado (MAM, AVE, REP, PEC).
    Retorna los parámetros del ajuste y la curva teórica.
    """
    cluster_id = cluster_id.upper()
    if cluster_id not in dataset:
        return {"error": "Clúster no encontrado. Utilice MAM, AVE, REP o PEC."}
        
    data = dataset[cluster_id]
    
    # Extraer arrays
    x_vals = [d["masa"] for d in data]
    y_vals = [d["metabolismo"] for d in data]
    
    # Calcular
    try:
        result = calculate_least_squares_potential(x_vals, y_vals)
        return {
            "cluster": cluster_id,
            "data_points": [{"x": x, "y": y, "especie": d["especie"]} for x, y, d in zip(x_vals, y_vals, data)],
            "fit": result
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/fit-all")
def get_fit_all():
    """
    Ajusta todos los clústeres simultáneamente y los retorna.
    """
    results = {}
    for cluster_id, data in dataset.items():
        x_vals = [d["masa"] for d in data]
        y_vals = [d["metabolismo"] for d in data]
        results[cluster_id] = {
            "data_points": [{"x": x, "y": y, "especie": d["especie"]} for x, y, d in zip(x_vals, y_vals, data)],
            "fit": calculate_least_squares_potential(x_vals, y_vals)
        }
    return results
