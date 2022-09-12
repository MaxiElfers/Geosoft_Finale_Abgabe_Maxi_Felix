const express = require('express')
const path = require('path')

const app = express()
const port = 3000

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(jsonParser);

const { MongoClient } = require('mongodb')

const url = 'mongodb://mongo:27017' // connection URL
   
const client = new MongoClient(url) // mongodb client
   
const dbName = 'mydatabase' // database name
   
const collectionName = 'pois' // collection name  

/**
//ab hier
const cors = require('cors');
app.use(cors());
app.options('*', cors()); //put this before your route
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})*/

// rendering static files 
app.use(express.static('public'))

// Path definition for the starting Website
app.get('/', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Home.html'))
})

// Path definition for the first Website
app.get('/add', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Add.html'))
})

// Path definition for the second Website
app.get('/route', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Route.html'))
})

// Path definition for the third Website
app.get('/delete', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Delete.html'))
})

// Path defintion for the change website
app.get('/change', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Change.html'))
})

// Path defintion for the impressum website
app.get('/impressum', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Impressum.html'))
})

// Path definition for the fetch
app.get('/getPoi', (req, res) =>
{
  getPOIs(req, res)
       .then(console.log)
       .catch(console.error)
       .finally(() => setTimeout(() => {client.close()}, 1500))
})

// Path definition for the fetch post
app.post('/addPoi', function(req, res, next)
{  
  addPOIs(req.body)
       .catch(console.error)
       .finally(() => setTimeout(() => {client.close()}, 1500))
})

// Path definition for the fetch delete
app.delete('/deletePoi', function(req, res)
{
  deletePOIs(req.body)
       .catch(console.error)
       .finally(() => setTimeout(() => {client.close()}, 1500))
})

app.listen(port, () => 
{
  console.log(`App listening at http://localhost:${port}`)
})

/**
 * pulls all the POIs from the database
 * @param  req 
 * @param  res 
 */
async function getPOIs(req, res)
{
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName) 
  const collection = db.collection(collectionName)

  const cursor =  collection.find({})

  const results = await cursor.toArray()

  if (results.length == 0)
  {
   
    console.log("No documents found!")
   
  }
  else
  {
    console.log(`Found ${results.length} documents in the collection...`);
    res.send(results);
  }
}

/**
 * Adds the data to the database
 * @param {Object} data 
 */
async function addPOIs(data) 
{
  await client.connect()
  console.log('Connected successfully to server')
   
  const db = client.db(dbName)
   
  const collection = db.collection(collectionName)

  await collection.insertOne(data) //function to insert one object
  console.log("Marker added successfuly")
}

/**
 * deletes the object from the database
 * @param {object} data 
 */
async function deletePOIs(data){
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
   
  const collection = db.collection(collectionName)
  console.log(data.id)
  collection.deleteOne({"id": data.id}) // function to delete the object with the id given from the database
}