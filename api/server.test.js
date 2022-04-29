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
    test('getAll', async () => {
        const result = await Singers.getAll();
        expect(result.constructor.name).toBe('Array')
        expect(result.length).toBe(3)
        expect(result[1]).toMatchObject({ name: 'Roy Kim' })
    })
    test('insert', async () => {
        let result = await Singers.insert({ name: 'Song Ga In'})
        expect(result).toHaveProperty('name', 'Song Ga In')
        expect(result.id).toBe(4)
        result = await Singers.getAll()
        expect(result.length).toBe(4)
    })
    test('getById', async () => {
        let result = await Singers.getById(0);
        expect(result).not.toBeDefined();
        result = await Singers.getById(1);
        expect(result).toBeDefined();
        expect(result.name).toBe('Song Sohee');
    });
    test('update', async () => {
        let result = await Singers.update(3, { name: 'Johnny Cash' });
        expect(result).toEqual({ id: 3, name: 'Johnny Cash' });
        result = await Singers.getAll();
        expect(result).toHaveLength(3);
    });
    test('remove', async () => {
        let result = await Singers.remove(1);
        expect(result).toHaveProperty('name', 'Song Sohee');
        result = await Singers.getAll();
        expect(result).toHaveLength(2);
        expect(result[1].id).toBe(3);
    });
})

describe('HTTP endpoint tests', () => {
    test('GET /singers', async () => {
        const res = await request(server).get('/singers');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
    });
    test('GET /singers/:id', async () => {
        let res = await request(server).get('/singers/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: 'Song Sohee' });

        res = await request(server).get('/singers/100');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Singer not found');
    });
    test('POST /singers', async () => {
        let res = await request(server).post('/singers').send({ name: 'Zheng Zhi Hua' });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: 4, name: 'Zheng Zhi Hua' });

        let result = await Singers.getAll();
        expect(result).toHaveLength(4);

        res = await request(server).post('/singers').send({});
        expect(res.status).toBe(500);

        result = await Singers.getAll();
        expect(result).toHaveLength(4);
    });
    test('DELETE /singers/:id', async () => {
        let res = await request(server).delete('/singers/2');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 2, name: 'Roy Kim' });

        let result = await Singers.getAll();
        expect(result).toHaveLength(2);

        res = await request(server).delete('/singers/2');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Singer not found');

        result = await Singers.getAll();
        expect(result).toHaveLength(2);
    });
    test('PUT /singers/:id', async () => {
        let res = await request(server).put('/singers/3').send({ name: 'Miyuki Nakajima' });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 3, name: 'Miyuki Nakajima' });

        let result = await Singers.getById(3);
        expect(result).toHaveProperty('name', 'Miyuki Nakajima');

        result = await Singers.getAll();
        expect(result).toHaveLength(3);

        res = await request(server).put('/singers/300').send({ name: 'Miyuki Nakajima' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Singer not found');

        res = await request(server).put('/singers/1').send({ name: null });
        expect(res.status).toBe(500);
    });
});
