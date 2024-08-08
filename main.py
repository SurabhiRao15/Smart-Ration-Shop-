from pymongo import MongoClient
import json

# Connect to the MongoDB server
client = MongoClient('mongodb+srv://swara:swara@cluster0.uojygpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

# Access the database (will be created if it doesn't exist)
db = client['<dbname>']

# Access the collection (will be created if it doesn't exist)
collection = db['users']

# JSON data to be insertedpip
json_data = '''
[
  {
    "username": "john_doe",
    "password": "hashed_password",
    "rationCardNumber": "RC123456",
    "items": [
      {
        "name": "rice",
        "status": "claimed",
        "quantity_kg": 10
      },
      {
        "name": "wheat",
        "status": "pending",
        "quantity_kg": 5
      },
      {
        "name": "sugar",
        "status": "claimed",
        "quantity_kg": 2
      },
      {
        "name": "oil",
        "status": "claimed",
        "quantity_litres": 1
      },
      {
        "name": "salt",
        "status": "claimed",
        "quantity_kg": 1
      }
    ]
  },
  {
    "username": "jane_smith",
    "password": "hashed_password",
    "rationCardNumber": "RC654321",
    "items": [
      {
        "name": "rice",
        "status": "pending",
        "quantity_kg": 8
      },
      {
        "name": "wheat",
        "status": "claimed",
        "quantity_kg": 4
      },
      {
        "name": "sugar",
        "status": "claimed",
        "quantity_kg": 3
      },
      {
        "name": "oil",
        "status": "pending",
        "quantity_litres": 2
      },
      {
        "name": "salt",
        "status": "claimed",
        "quantity_kg": 2
      }
    ]
  }
]

'''

# Convert JSON string to Python list of dictionaries
data = json.loads(json_data)

# Insert the data into the collection
collection.insert_many(data)

print("Data inserted successfully")