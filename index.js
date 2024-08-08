const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const uri = 'mongodb+srv://swara:swara@cluster0.uojygpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('<dbname>');
    const collection = database.collection('users');

    const { username, rationCardNumber, password } = req.body;

    if (!username || !rationCardNumber || !password) {
      return res.status(400).send('All fields are required');
    }

    const result = await collection.insertOne({
      name: username,
      ration_id: rationCardNumber,
      password: password
    });

    console.log(`Inserted ${result.insertedCount} document(s)`);
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
    console.log('Connection to MongoDB closed');
  }
});

app.post('/login', async (req, res) => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('<dbname>');
    const collection = database.collection('users');

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    const user = await collection.findOne({
      name: username,
      password: password
    });

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    res.status(200).send('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
    console.log('Connection to MongoDB closed');
  }
});

app.post('/getRationStatus', async (req, res) => {
    const rationCardNumber = "1209456";

    try {
        await client.connect();
        const database = client.db('<dbname>');
        const collection = database.collection('users');
        
        const user = await collection.findOne({ rationCardNumber });
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ items: user.items });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.post('/claimItems', async (req, res) => {
    const rationCardNumber = "1209456";

    try {
        await client.connect();
        const database = client.db('<dbname>');
        const collection = database.collection('users');

        const result = await collection.updateMany(
            { rationCardNumber, "items.status": "pending" },
            { $set: { "items.$.status": "claimed" } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('No pending items found');
        }

        res.status(200).send('Pending items claimed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
