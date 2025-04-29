require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();
const dns = require('dns');
const urlDatabase = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(urlencoded({extended: true}));
app.use(express.json());

app.post("/api/shorturl",(req, res)=>{
  console.log(req.headers['content-type']);
  console.log(req.body);

  const inputUrl = req.body.url;

  try {
    const urlObj = new URL(inputUrl);
    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }
      const short = Math.floor(Math.random() * 100000);
      urlDatabase[short] = inputUrl;
      res.json({ original_url: inputUrl, short_url: short });
    });
  } catch (e) {
    return res.json({ error: "invalid url" });
  }
});

app.get('/api/shorturl/:short', (req, res) => {
  const short = req.params.short;
  const originalUrl = urlDatabase[short];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for given input" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});