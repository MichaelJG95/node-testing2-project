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

module.exports = server;