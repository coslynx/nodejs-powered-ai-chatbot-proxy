# nodejs-powered-ai-chatbot-proxy

<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
nodejs-powered-ai-chatbot-proxy
</h1>
<h4 align="center">AI Interaction Proxy & Scripting Toolkit (AI-IPST) - A comprehensive solution for analyzing, modifying, and scripting client-side interactions with web-based AI chatbots</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-Next.js-blue" alt="Next.js">
  <img src="https://img.shields.io/badge/Frontend-Javascript,_Html,_Css-red" alt="JavaScript, HTML, CSS">
  <img src="https://img.shields.io/badge/Backend-Node.js,_Express.js-blue" alt="Node.js, Express.js">
  <img src="https://img.shields.io/badge/LLMs-Custom,_Gemini,_OpenAI-black" alt="Custom, Gemini, OpenAI">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/nodejs-powered-ai-chatbot-proxy?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/nodejs-powered-ai-chatbot-proxy?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/nodejs-powered-ai-chatbot-proxy?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
The AI Interaction Proxy & Scripting Toolkit (AI-IPST) is a Minimum Viable Product (MVP) that provides a comprehensive solution for analyzing, modifying, and scripting client-side interactions with web-based AI chatbots. The project leverages a Node.js/Express.js backend, a Next.js 14 frontend with the App Router, and integrates with custom, Gemini, and OpenAI language models to enable advanced functionality.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture**   | The codebase follows a modular architectural pattern with separate directories for different functionalities, such as the proxy server, userscript management, and network traffic logging. This ensures easier maintenance and scalability.             |
| 📄 | **Documentation**  | The repository includes a comprehensive README file that provides an overview of the MVP, its dependencies, and detailed usage instructions.|
| 🔗 | **Dependencies**   | The codebase relies on various external libraries and packages, including Express.js, Mongoose, Jsonwebtoken, and Tailwind CSS, which are essential for building the proxy server, managing user authentication, and styling the user interface.|
| 🧩 | **Modularity**     | The modular structure allows for easier maintenance and reusability of the code, with separate directories and files for the proxy controller, script controller, logging controller, and various supporting services and models.|
| 🧪 | **Testing**        | The project includes unit tests using Jest and Supertest to ensure the reliability and robustness of the codebase, with a target of at least 90% code coverage.       |
| ⚡️  | **Performance**    | The performance of the system is optimized through techniques such as caching strategies, asynchronous processing, and event loop optimizations to ensure high-performance request handling.|
| 🔐 | **Security**       | The application implements comprehensive security measures, including input validation, data sanitization, rate limiting, and JWT-based authentication and authorization, to protect against common vulnerabilities.|
| 🔀 | **Version Control**| The project utilizes Git for version control, with a GitHub repository and GitHub Actions workflow files for automated build and release processes.|
| 🔌 | **Integrations**   | The AI-IPST toolkit integrates with various browser APIs, external services through HTTP requests, and includes integrations with Greasemonkey, Tampermonkey, and Violentmonkey userscript managers.|
| 📶 | **Scalability**    | The system is designed to handle increased user load and data volume, utilizing caching strategies and cloud-based solutions for better scalability.           |

## 📂 Structure
```text
└─ src
   └─ controllers
      └─ proxyController.js
      └─ scriptController.js
      └─ loggingController.js
   └─ services
      └─ proxyService.js
      └─ scriptService.js
      └─ loggingService.js
   └─ models
      └─ ProxyConfig.js
      └─ Userscript.js
      └─ LogEntry.js
   └─ routes
      └─ proxyRoutes.js
      └─ scriptRoutes.js
      └─ loggingRoutes.js
   └─ middleware
      └─ proxyMiddleware.js
      └─ authMiddleware.js
      └─ errorHandler.js
   └─ config
      └─ database.js
      └─ config.js
   └─ utils
      └─ logger.js
      └─ helpers.js
   └─ app.js
└─ tests
   └─ unit
      └─ proxyService.test.js
      └─ scriptService.test.js
      └─ loggingService.test.js
   └─ integration
      └─ proxyRoutes.test.js
      └─ scriptRoutes.test.js
      └─ loggingRoutes.test.js
└─ .env
└─ package.json
└─ README.md
└─ startup.sh
└─ commands.json
```

## 💻 Installation
> [!WARNING]
> ### 🔧 Prerequisites
> - Node.js v14+
> - npm 6+
> - MongoDB 4.4+

### 🚀 Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/coslynx/nodejs-powered-ai-chatbot-proxy.git
   cd nodejs-powered-ai-chatbot-proxy
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the MongoDB database:
   ```bash
   cp .env.example .env
   # Fill in the required environment variables, such as the MongoDB connection string
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Fill in the necessary environment variables, such as the JWT secret, proxy target hostname and port, logging settings, and external API keys
   ```

## 🏗️ Usage
### 🏃‍♂️ Running the MVP
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Start the MongoDB database and API server:
   ```bash
   # Start MongoDB database
   docker-compose up -d mongodb
   
   # Run database migrations
   npm run migrate
   
   # Start the API server
   npm run api
   ```

3. Access the application:
   - Web interface: [http://localhost:3000](http://localhost:3000)
   - API endpoint: [http://localhost:3000/api](http://localhost:3000/api)

> [!TIP]
> ### ⚙️ Configuration
> - The `.env` file contains all the necessary environment variables for the application, such as the MongoDB connection string, JWT secret, proxy target hostname and port, logging settings, and external API keys.
> - Modify the values in the `.env` file to match your specific deployment requirements.

### 📚 Examples
Explore the following examples to understand the key features of the AI-IPST MVP:

- 📝 **Intercepting and Modifying a Proxy Request**:
  ```bash
  curl -X POST http://localhost:3000/api/proxy/modify/request \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"method": "POST", "url": "https://example.com/api", "headers": {"Content-Type": "application/json"}, "body": {"data": "foo"}}'
  ```

- 📝 **Injecting a Custom Proxy Response**:
  ```bash
  curl -X POST http://localhost:3000/api/proxy/inject \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": {"data": "bar"}}'
  ```

- 📝 **Executing a Userscript**:
  ```bash
  curl -X POST http://localhost:3000/api/scripts/123/execute \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"context": {"window": {}}}'
  ```

## 🌐 Hosting
### 🚀 Deployment Instructions
The AI-IPST MVP can be deployed to various cloud platforms, such as Heroku, AWS, or Google Cloud. The following example demonstrates the deployment process for Heroku:

#### Deploying to Heroku
1. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create nodejs-powered-ai-chatbot-proxy-production
   ```
4. Set up environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri_here
   heroku config:set JWT_SECRET=your_jwt_secret_here
   heroku config:set PROXY_TARGET_HOSTNAME=example.com
   heroku config:set PROXY_TARGET_PORT=80
   heroku config:set LOG_LEVEL=info
   heroku config:set LOG_DIR=./logs
   ```
5. Deploy the code:
   ```bash
   git push heroku main
   ```
6. Run database migrations (if applicable):
   ```bash
   heroku run npm run migrate
   ```

### 🔑 Environment Variables
The following environment variables are required for the AI-IPST MVP:

- `MONGODB_URI`: Connection string for the MongoDB database
  Example: `mongodb://user:password@host:port/database`
- `JWT_SECRET`: Secret key for JWT token generation
  Example: `your-256-bit-secret`
- `PROXY_TARGET_HOSTNAME`: Hostname of the target server for the proxy
  Example: `example.com`
- `PROXY_TARGET_PORT`: Port of the target server for the proxy
  Example: `80`
- `LOG_LEVEL`: Log level for the application (e.g., 'info', 'debug', 'error')
  Example: `info`
- `LOG_DIR`: Directory for storing log files
  Example: `./logs`
- `OPENAI_API_KEY`: API key for the OpenAI language model (if applicable)
  Example: `your_openai_api_key`
- `ANTHROPIC_API_KEY`: API key for the Anthropic language model (if applicable)
  Example: `your_anthropic_api_key`

## 📄 API Documentation
### 🔍 Endpoints
The AI-IPST MVP provides the following API endpoints:

- **GET /api/proxy/config**
  - Description: Fetch the current proxy configuration
  - Authentication: Required
  - Response: `{ targetHostname: string, targetPort: number, requestModifications: { [key: string]: any }, responseModifications: { [key: string]: any } }`

- **PUT /api/proxy/config**
  - Description: Update the proxy configuration
  - Authentication: Required
  - Body: `{ targetHostname: string, targetPort: number, requestModifications: { [key: string]: any }, responseModifications: { [key: string]: any } }`
  - Response: `{ message: string }`

- **GET /api/proxy/traffic**
  - Description: Retrieve the logged proxy traffic
  - Authentication: Required
  - Query Params: `{ startDate: string, endDate: string, targetUrl: string, method: string, page: number, limit: number }`
  - Response: `[ { method: string, url: string, headers: { [key: string]: string }, body: any, statusCode: number, responseHeaders: { [key: string]: string }, responseBody: any } ]`

- **POST /api/proxy/modify/request**
  - Description: Modify an intercepted proxy request
  - Authentication: Required
  - Body: `{ method: string, url: string, headers: { [key: string]: string }, body: any }`
  - Response: `{ method: string, url: string, headers: { [key: string]: string }, body: any }`

- **POST /api/proxy/modify/response**
  - Description: Modify an intercepted proxy response
  - Authentication: Required
  - Body: `{ statusCode: number, headers: { [key: string]: string }, body: any }`
  - Response: `{ statusCode: number, headers: { [key: string]: string }, body: any }`

- **POST /api/proxy/inject**
  - Description: Inject a custom response without forwarding the original request
  - Authentication: Required
  - Body: `{ statusCode: number, headers: { [key: string]: string }, body: any }`
  - Response: `{ statusCode: number, headers: { [key: string]: string }, body: any }`

### 🔒 Authentication
The AI-IPST MVP uses JWT-based authentication for securing the API endpoints. The authentication flow is as follows:

1. Register a new user or login to receive a JWT token.
2. Include the token in the `Authorization` header for all protected routes:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
3. The token will expire after a configured duration, and a refresh token can be used to obtain a new access token.

### 📝 Examples
Explore the following examples to understand the API usage:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "aiuser", "email": "user@example.com", "password": "securepassword123"}'

# Response
{
  "id": "user123",
  "username": "aiuser",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# Modify an intercepted proxy request
curl -X POST http://localhost:3000/api/proxy/modify/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"method": "POST", "url": "https://example.com/api", "headers": {"Content-Type": "application/json"}, "body": {"data": "foo"}}'

# Response
{
  "method": "POST",
  "url": "https://example.com/api",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "data": "foo"
  }
}
```

> [!NOTE]
> ## 📜 License & Attribution
> 
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGP