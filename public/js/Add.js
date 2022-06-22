var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017' // connection URL
const client = new MongoClient(url) // mongodb client
const dbName = 'mydatabase' // database name
const collectionName = 'pois' // collection name


/* define the search route : retrieve all elements from the database and use it as input for autocomplete */
router.get('/', function (req, res, next) 
{

  retrieveAllPOIsfromDB(client, dbName, collectionName, res)
        .then(console.log)
        .catch(console.error)
        .finally(() => setTimeout(() => {client.close()}, 1500)) // wait a bit before closing the connection, if not the whole code can raise an error, see https://stackoverflow.com/questions/72155712/mongoruntimeerror-connection-pool-closed

})

// retrieve all elements from the database, and pass the results as input data for the search page
async function retrieveAllPOIsfromDB(client, dbName, collectionName, res) 
{

  await client.connect()
  console.log('Connected successfully to server')

  const db = client.db(dbName)

  const collection = db.collection(collectionName)

  const cursor =  collection.find({})
   
  const results = await cursor.toArray()

  // get the geojson object (because toArray has generated an array)
  console.log(results[0])

  // pass the results data as input for the search page
  res.render('search', { title: 'Searching Page', data: results[0] });
  
}


module.exports = router;