import requests
import json
try:
    res = requests.post("http://127.0.0.1:8000/generate", json={"topic": "Artificial Intelligence"})
    print(res.status_code)
    print(res.text)
except Exception as e:
    print(e)
