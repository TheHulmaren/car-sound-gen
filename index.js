import express from 'express';
const app = express()

import path from 'path';
const __dirname = path.resolve();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(8000, ()=>{
    console.log("Connected to Port 8000")
})
