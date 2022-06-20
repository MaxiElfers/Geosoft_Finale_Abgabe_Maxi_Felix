const express = require('express')
const path = require('path')

const app = express()
const port = 3000 // unsafe ports: https://superuser.com/questions/188058/which-ports-are-considered-unsafe-by-chrome 


/* // Middleware
var myLogger = function (req, res, next) 
{
  console.log('LOGGED')
  next()
}
var mySecondLogger = function (req, res, next) 
{
  console.log('SECOND LOGGING')
  next()
}
app.use(mySecondLogger)
app.use(myLogger)
*/

// define a route
// function taken from https://expressjs.com/de/starter/hello-world.html
app.get('/', (req, res) => 
{
  //res.send('Hello World!')
  //res.set('Content-Type', 'text/html');
  //res.sendFile(path.join(__dirname, '/public', 'example06.html'))
})


// serve static files
// function taken from https://expressjs.com/de/starter/static-files.html 
//app.use(express.static('public'))
//app.use('/static', express.static('public'))
//app.use('/static', express.static(path.join(__dirname, 'public')))
//console.log(__dirname) // __dirname tells you the absolute path of the directory containing the currently executing file
//console.log(path.join(__dirname, 'public'))

// redirection of the basic path to the html page used as an entry point for the static website
/*
app.get('/', (req, res) => 
{
    res.redirect('/example06.html')
})
*/

app.listen(port, () => 
{
  console.log(`App listening at http://localhost:${port}`)
})