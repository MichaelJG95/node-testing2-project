const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
const Singers = require('./favoriteSingers/fav-singers-model')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('favoriteSingers').truncate()
    await db('favoriteSingers')
        .insert([
            { name: 'Song Sohee' },
            { name: 'Roy Kim' },
            { name: 'Stromae' },
        ])
})

afterAll(async () => {
    await db.destroy()
})

test('environment is set correctly', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

test('server is up', async () => {
    const res = await request(server).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ api: 'up' })
})

describe('db tests', () => {

})