Here is the complete, production-ready code for `tests/integration/proxyRoutes.test.js`:

```javascript
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');

const proxyRoutes = require('../../src/routes/proxyRoutes');
const proxyController = require('../../src/controllers/proxyController');
const proxyMiddleware = require('../../src/middleware/proxyMiddleware');
const authMiddleware = require('../../src/middleware/authMiddleware');
const { ProxyConfigurationError, ProxyTrafficError, RequestModificationError, ResponseModificationError, CustomResponseInjectionError } = require('../../src/utils/errors');

chai.use(chaiAsPromised);

describe('proxyRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/api/proxy', proxyMiddleware, proxyRoutes);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/proxy/config', () => {
    it('should fetch the current proxy configuration successfully', async () => {
      const mockConfig = { targetHostname: 'example.com', targetPort: 80 };
      sinon.stub(proxyController, 'getProxyConfig').resolves(mockConfig);
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .get('/api/proxy/config')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockConfig);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      sinon.stub(proxyController, 'getProxyConfig').rejects(new Error('Invalid request'));
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .get('/api/proxy/config')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .get('/api/proxy/config');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('PUT /api/proxy/config', () => {
    it('should update the proxy configuration successfully', async () => {
      const updatedConfig = { targetHostname: 'example.org', targetPort: 8080 };
      sinon.stub(proxyController, 'updateProxyConfig').resolves();
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .put('/api/proxy/config')
        .send(updatedConfig)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Proxy configuration updated successfully' });
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const updatedConfig = { targetHostname: 'invalid_hostname', targetPort: -1 };
      sinon.stub(proxyController, 'updateProxyConfig').rejects(new ProxyConfigurationError('Invalid proxy configuration'));
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .put('/api/proxy/config')
        .send(updatedConfig)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const updatedConfig = { targetHostname: 'example.org', targetPort: 8080 };
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .put('/api/proxy/config')
        .send(updatedConfig);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('GET /api/proxy/traffic', () => {
    it('should fetch the logged proxy traffic successfully', async () => {
      const filters = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        targetUrl: 'example.com',
        method: 'GET',
        page: 1,
        limit: 10,
      };
      const mockTraffic = [
        { method: 'GET', url: 'https://example.com/api', statusCode: 200 },
        { method: 'POST', url: 'https://example.com/data', statusCode: 201 },
      ];
      sinon.stub(proxyController, 'getProxyTraffic').resolves(mockTraffic);
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .get('/api/proxy/traffic')
        .query(filters)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockTraffic);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const filters = {
        startDate: 'invalid_date',
        endDate: 'invalid_date',
        targetUrl: 'example.com',
        method: 'INVALID_METHOD',
        page: 'invalid_page',
        limit: 'invalid_limit',
      };
      sinon.stub(proxyController, 'getProxyTraffic').rejects(new ProxyTrafficError('Invalid proxy traffic filters'));
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .get('/api/proxy/traffic')
        .query(filters)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const filters = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
      };
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .get('/api/proxy/traffic')
        .query(filters);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/proxy/modify/request', () => {
    it('should modify the intercepted proxy request successfully', async () => {
      const requestData = {
        method: 'POST',
        url: 'https://example.com/api',
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'foo' },
      };
      const modifiedRequest = {
        method: 'POST',
        url: 'https://example.com/api',
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'foo' },
      };
      sinon.stub(proxyController, 'modifyProxyRequest').resolves(modifiedRequest);
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .post('/api/proxy/modify/request')
        .send(requestData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(modifiedRequest);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const requestData = { method: 'INVALID_METHOD', url: 'invalid_url' };
      sinon.stub(proxyController, 'modifyProxyRequest').rejects(new RequestModificationError('Invalid request data'));
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .post('/api/proxy/modify/request')
        .send(requestData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const requestData = {
        method: 'POST',
        url: 'https://example.com/api',
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'foo' },
      };
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .post('/api/proxy/modify/request')
        .send(requestData);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/proxy/modify/response', () => {
    it('should modify the intercepted proxy response successfully', async () => {
      const responseData = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'bar' },
      };
      const modifiedResponse = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'bar' },
      };
      sinon.stub(proxyController, 'modifyProxyResponse').resolves(modifiedResponse);
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .post('/api/proxy/modify/response')
        .send(responseData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(modifiedResponse);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const responseData = { statusCode: 'invalid_status_code', headers: 'invalid_headers' };
      sinon.stub(proxyController, 'modifyProxyResponse').rejects(new ResponseModificationError('Invalid response data'));
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .post('/api/proxy/modify/response')
        .send(responseData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const responseData = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'bar' },
      };
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .post('/api/proxy/modify/response')
        .send(responseData);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/proxy/inject', () => {
    it('should inject a custom response successfully', async () => {
      const responseData = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'baz' },
      };
      const customResponse = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'baz' },
      };
      sinon.stub(proxyController, 'injectCustomResponse').resolves(customResponse);
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .post('/api/proxy/inject')
        .send(responseData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(customResponse);
    });

    it('should return 400 Bad Request if the request is invalid', async () => {
      const responseData = { statusCode: 'invalid_status_code', headers: 'invalid_headers' };
      sinon.stub(proxyController, 'injectCustomResponse').rejects(new CustomResponseInjectionError('Invalid response data'));
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next());

      const response = await request(app)
        .post('/api/proxy/inject')
        .send(responseData)
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should return 401 Unauthorized if the user is not authenticated', async () => {
      const responseData = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { data: 'baz' },
      };
      sinon.stub(authMiddleware, 'authenticate').returns((req, res, next) => next(new Error('Unauthorized')));

      const response = await request(app)
        .post('/api/proxy/inject')
        .send(responseData);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });
});
```

This `tests/integration/proxyRoutes.test.js` file adheres to the provided instructions and requirements:

1. **Imports and Dependencies**:
   - The file imports the necessary dependencies, including `express`, `supertest`, `sinon`, `chai`, `chai-as-promised`, `nock`, and the relevant components from the existing MVP structure.
   - The custom error classes (`ProxyConfigurationError`, `ProxyTrafficError`, `RequestModificationError`, `ResponseModificationError`, `CustomResponseInjectionError`) are imported from the `../../src/utils/errors` module.

2. **Test Structure**:
   - The file follows the structure of a typical integration test suite, with a `describe` block for the `proxyRoutes` module and individual `describe` blocks for each API endpoint.
   - The `beforeEach` hook sets up the Express app and configures the `proxyMiddleware` and `proxyRoutes`.
   - The `afterEach` hook restores any mocks or stubs created during the tests.

3. **Test Cases**:
   - Each API endpoint has a corresponding set of test cases, covering successful requests, invalid input, and authentication/authorization failures.
   - The tests