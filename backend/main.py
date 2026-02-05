from fastapi import FastAPI
import redis
import json
import time

app = FastAPI()

# Connect to Redis (assuming 'redis' is the service name in docker-compose)
cache = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

# Simulated Database
MOCK_PRODUCTS = [
    {"id": 1, "name": "Cloud Architecture Pro", "category": "Software"},
    {"id": 2, "name": "Scalable Systems Handbook", "category": "Books"},
    {"id": 3, "name": "Redis Mastery Course", "category": "Education"}
]

@app.get("/search")
async def search_products(q: str):
    start_time = time.time()
    
    # 1. Check Redis Cache
    cached_data = cache.get(q)
    if cached_data:
        return {
            "source": "Redis Cache",
            "latency": f"{time.time() - start_time:.5f}s",
            "results": json.loads(cached_data)
        }

    # 2. Simulate "Heavy" Database Query
    time.sleep(0.5)  # 500ms artificial delay
    results = [p for p in MOCK_PRODUCTS if q.lower() in p["name"].lower()]
    
    # 3. Save to Cache for 60 seconds
    cache.setex(q, 60, json.dumps(results))

    return {
        "source": "PostgreSQL Database",
        "latency": f"{time.time() - start_time:.5f}s",
        "results": results
    }
