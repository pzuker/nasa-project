const request = require('supertest');

const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /v1/planets', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/planets')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test GET /v1/launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /v1/launches', () => {
    const launchData = {
      mission: 'Kepler Exploration X1',
      rocket: 'Explorer IS11',
      launchDate: 'December 27, 2030',
      target: 'Kepler-442 b',
    };

    const launchDataWithoutDate = {
      mission: 'Kepler Exploration X1',
      rocket: 'Explorer IS11',
      target: 'Kepler-442 b',
    };

    const launchDataWithInvalidDate = {
      mission: 'Kepler Exploration X1',
      rocket: 'Explorer IS11',
      launchDate: 'December 327, 2030',
      target: 'Kepler-442 b',
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing data', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch data',
      });
    });

    test('It should catch invalid date', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Launch date invalid' });
    });
  });
});
