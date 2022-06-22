const express = require('express')
const path = require('path')

const app = express()
const port = 3000


const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017' // connection URL
   
const client = new MongoClient(url) // mongodb client
   
const dbName = 'mydatabase' // database name
   
const collectionName = 'pois' // collection name

// rendering static files 
app.use(express.static('public'))

// Path definition for the starting Website
app.get('/', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'StartSeite.html'))
})

// Path definition for the first Website
app.get('/add', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Add.html'))
})

// Path definition for the second Website
app.get('/display', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Display.html'))
})

// Path definition for the third Website
app.get('/delete', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Delete.html'))
})

app.get('/getPoi', (req, res) =>
{
  getPOIs(req, res)
       .then(console.log)
       .catch(console.error)
       .finally(() => setTimeout(() => {client.close()}, 1500))
})

app.get('/addPoi', (req, res) =>
{

})

app.listen(port, () => 
{
  console.log(`App listening at http://localhost:${port}`)
})


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