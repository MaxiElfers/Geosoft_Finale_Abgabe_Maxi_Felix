const express = require('express')
const path = require('path')

const app = express()
const port = 3000


// rendering static files 
app.use(express.static('public'))

// Path definition for the starting Website
app.get('/', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'StartSeite.html'))
})

// Path definition for the first Website
app.get('/1', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Seite1.html'))
})

// Path definition for the second Website
app.get('/2', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Seite2.html'))
})

// Path definition for the third Website
app.get('/3', (req, res) => 
{
  res.sendFile(path.join(__dirname, '/public', 'Seite3.html'))
})

app.listen(port, () => 
{
  console.log(`App listening at http://localhost:${port}`)
})