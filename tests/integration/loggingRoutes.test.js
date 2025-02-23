Here is the complete, production-ready code for `tests/integration/loggingRoutes.test.js`:

```javascript
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const loggingRoutes = require('../../src/routes/loggingRoutes');
const loggingController = require('../../src/controllers/loggingController');
const authMiddleware = require('../../src/middleware/authMiddleware');
const { LoggingConfigurationError, LogEntryError } = require('../../src/utils/errors');

chai.use(chaiAsPromised);

describe('loggingRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/api/logs', authMiddleware.authenticate(), loggingRoutes);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/logs', () => {
    it('should fetch the list of network traffic logs successfully', async () => {
      const filters = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        targetUrl: 'example.com',
        method: 'GET',
      };

      const pagination = {
        page: 1,
        limit: 10,
      };

      const mockLogs = [
        { method: 'GET', url: 'https://example.com/api', statusCode: 200 },
        { method: 'POST', url: 'https://example.com/data', statusCode: 201 },
      ];

      sinon.stub(loggingController, 'getLogs').resolves(mockLogs);

      const response = await request(app)
        .get('/api/logs')
        .query({ filters, pagination })
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockLogs);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const filters = {
        startDate: 'invalid_date',
        endDate: 'invalid_date',
        targetUrl: 'example.com',
        method: 'INVALID_METHOD',
      };

      const pagination = {
        page: 'invalid_page',
        limit: 'invalid_limit',
      };

      sinon.stub(loggingController, 'getLogs').rejects(new LogEntryError('Invalid log filters'));

      const response = await request(app)
        .get('/api/logs')
        .query({ filters, pagination })
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const filters = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
      };

      const pagination = {
        page: 1,
        limit: 10,
      };

      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .get('/api/logs')
        .query({ filters, pagination });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('GET /api/logs/:id', () => {
    it('should fetch a specific log entry by ID successfully', async () => {
      const logId = '123';
      const mockLog = { _id: '123', method: 'GET', url: 'https://example.com/api', statusCode: 200 };

      sinon.stub(loggingController, 'getLogById').resolves(mockLog);

      const response = await request(app)
        .get(`/api/logs/${logId}`)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockLog);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const logId = 'invalid_id';
      sinon.stub(loggingController, 'getLogById').rejects(new LogEntryError(`Log entry with ID ${logId} not found`));

      const response = await request(app)
        .get(`/api/logs/${logId}`)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const logId = '123';
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .get(`/api/logs/${logId}`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/logs', () => {
    it('should create a new network traffic log entry successfully', async () => {
      const newLogData = {
        requestUrl: 'https://example.com/api',
        requestMethod: 'POST',
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { data: 'foo' },
        responseStatusCode: 201,
        responseHeaders: { 'Content-Type': 'application/json' },
        responseBody: { id: 123 },
        timestamp: Date.now(),
      };

      const newLog = { _id: '123', ...newLogData };

      sinon.stub(loggingController, 'createLog').resolves(newLog);

      const response = await request(app)
        .post('/api/logs')
        .send(newLogData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(newLog);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const newLogData = {
        requestUrl: 'invalid_url',
        requestMethod: 'INVALID_METHOD',
        requestHeaders: 'invalid_headers',
        requestBody: 'invalid_body',
        responseStatusCode: 'invalid_status_code',
        responseHeaders: 'invalid_headers',
        responseBody: 'invalid_body',
        timestamp: 'invalid_timestamp',
      };

      sinon.stub(loggingController, 'createLog').rejects(new LogEntryError('Invalid log data'));

      const response = await request(app)
        .post('/api/logs')
        .send(newLogData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const newLogData = {
        requestUrl: 'https://example.com/api',
        requestMethod: 'POST',
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { data: 'foo' },
        responseStatusCode: 201,
        responseHeaders: { 'Content-Type': 'application/json' },
        responseBody: { id: 123 },
        timestamp: Date.now(),
      };

      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .post('/api/logs')
        .send(newLogData);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('PUT /api/logs/:id', () => {
    it('should update an existing network traffic log entry successfully', async () => {
      const logId = '123';
      const updates = {
        requestUrl: 'https://example.com/api',
        requestMethod: 'PUT',
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { data: 'bar' },
        responseStatusCode: 200,
        responseHeaders: { 'Content-Type': 'application/json' },
        responseBody: { id: 456 },
        timestamp: Date.now(),
      };

      sinon.stub(loggingController, 'updateLog').resolves();

      const response = await request(app)
        .put(`/api/logs/${logId}`)
        .send(updates)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Log entry updated successfully' });
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const logId = '123';
      const updates = {
        requestUrl: 'invalid_url',
        requestMethod: 'INVALID_METHOD',
        requestHeaders: 'invalid_headers',
        requestBody: 'invalid_body',
        responseStatusCode: 'invalid_status_code',
        responseHeaders: 'invalid_headers',
        responseBody: 'invalid_body',
        timestamp: 'invalid_timestamp',
      };

      sinon.stub(loggingController, 'updateLog').rejects(new LogEntryError('Invalid log data'));

      const response = await request(app)
        .put(`/api/logs/${logId}`)
        .send(updates)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const logId = '123';
      const updates = {
        requestUrl: 'https://example.com/api',
        requestMethod: 'PUT',
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { data: 'bar' },
        responseStatusCode: 200,
        responseHeaders: { 'Content-Type': 'application/json' },
        responseBody: { id: 456 },
        timestamp: Date.now(),
      };

      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .put(`/api/logs/${logId}`)
        .send(updates);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('DELETE /api/logs/:id', () => {
    it('should delete a network traffic log entry successfully', async () => {
      const logId = '123';

      sinon.stub(loggingController, 'deleteLog').resolves();

      const response = await request(app)
        .delete(`/api/logs/${logId}`)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Log entry deleted successfully' });
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const logId = 'invalid_id';
      sinon.stub(loggingController, 'deleteLog').rejects(new LogEntryError(`Log entry with ID ${logId} not found`));

      const response = await request(app)
        .delete(`/api/logs/${logId}`)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const logId = '123';
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .delete(`/api/logs/${logId}`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('GET /api/logs/config', () => {
    it('should retrieve the current logging configuration successfully', async () => {
      const mockConfig = { logLevel: 'info', logRetentionDays: 14, targetUrls: ['example.com'] };

      sinon.stub(loggingController, 'getLoggingConfig').resolves(mockConfig);

      const response = await request(app)
        .get('/api/logs/config')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockConfig);
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .get('/api/logs/config');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('PUT /api/logs/config', () => {
    it('should update the logging configuration successfully', async () => {
      const updates = { logLevel: 'debug', logRetentionDays: 30, targetUrls: ['example.org'] };

      sinon.stub(loggingController, 'updateLoggingConfig').resolves();

      const response = await request(app)
        .put('/api/logs/config')
        .send(updates)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Logging configuration updated successfully' });
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const updates = { logLevel: 'invalid_level', logRetentionDays: -1, targetUrls: 'invalid_urls' };

      sinon.stub(loggingController, 'updateLoggingConfig').rejects(new LoggingConfigurationError('Invalid logging configuration'));

      const response = await request(app)
        .put('/api/logs/config')
        .send(updates)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const updates = { logLevel: 'debug', logRetentionDays: 30, targetUrls: ['example.org'] };

      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .put('/api/logs/config')
        .send(updates);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });
});
```

This `tests/integration/loggingRoutes.test.js` file adheres to the provided instructions and requirements:

1. **Imports and Dependencies**:
   - The file imports the necessary dependencies, including `express`, `supertest`, `sinon`, `chai`, `chai-as-promised`, and the relevant components from the existing MVP structure.
   - The custom error classes (`Logg