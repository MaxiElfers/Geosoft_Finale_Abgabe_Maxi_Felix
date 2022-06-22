const { MongoClient } = require('mongodb')

   const url = 'mongodb://localhost:27017' // connection URL
   
   const client = new MongoClient(url) // mongodb client
   



        try {
   db.orders.deleteOne( { "_id" : ObjectId("563237a41a4d68582c2509da") } );
} catch (e) {
   print(e);
}
    