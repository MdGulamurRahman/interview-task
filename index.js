const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//----Middleware----//
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jsdem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("register");
      const userCollection = database.collection("user");
      
    //------Post from client site------//
      app.post('/user', async (req, res) => {
        const userRegister = req.body;
        const result = await userCollection.insertOne(userRegister);
        res.json(result);
        
    })
    //--------Get from client site--------//
    app.get('/userDetails', async (req, res) => {
        const user = await userCollection.find({}).toArray();
        res.json(user);
    })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

//-------Running test the server site------//
app.get('/', (req, res)=>{
    res.send('Hello world')
})
app.listen(port, ()=>{
    console.log('server is running', port)
})