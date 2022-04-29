const express = require('express')

const Singers = require('./favoriteSingers/fav-singers-model')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json({ api: 'up' })
})

server.get('/singers', (req, res) => {
    Singers.getAll()
        .then(singers => {
            res.status(200).json(singers)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.get("/singers/:id", (req, res) => {
    Singers.getById(req.params.id)
      .then(singer => {
        if(singer == null) {
          res.status(404).json({ message: 'Singer not found' });
          return;
        }
        res.status(200).json(singer);
      });
  });
  
  server.post("/singers", (req, res) => {
    Singers.insert(req.body)
      .then(singer => {
        res.status(201).json(singer);
      })
      .catch(error => {
        res.status(500).json(error);
      })
  });
  
  server.delete("/singers/:id", (req, res) => {
    Singers.remove(req.params.id)
      .then(singer => {
        if(singer == null) {
          res.status(404).json({ message: 'Singer not found' });
          return;
        }
        res.status(200).json(singer);
      });
  });
  
  server.put("/singers/:id", (req, res) => {
    Singers.update(req.params.id, req.body)
      .then(singer => {
        if(singer == null) {
          res.status(404).json({ message: 'Singer not found' });
          return;
        }
        res.status(200).json(singer);
      })
      .catch(error => {
        res.status(500).json(error);
      })
  });

module.exports = server;