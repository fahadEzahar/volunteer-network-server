const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
console.log(process.env.DB_USER)
const port = 5000

const app = express();
app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ma8l7.mongodb.net/Volunteerdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// TASK COLLECTION
client.connect(err => {
  const taskCollection = client.db("Volunteerdb").collection("task");
  console.log('connected successfully')

  app.post('/addTask', (req, res) => {
    const newTask = req.body;
    taskCollection.insertOne(newTask)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/task', (req, res) => {
    taskCollection.find({ Email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/allEvents', (req, res) => {
    taskCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/remove/:id', (req, res) => {
    taskCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
      })
  })
});

// EVENTS COLLECTION
client.connect(err => {
  const eventCollection = client.db("Volunteerdb").collection("events");

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    eventCollection.insertOne(newEvent)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/events', (req, res) => {
    eventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
});

app.listen(process.env.PORT || port)