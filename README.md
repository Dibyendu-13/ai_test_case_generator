
# API Test Case Generator and Cohere API Integration

This project provides an Express.js-based backend service that generates test cases for APIs and integrates with the Cohere AI API for text generation. It includes features for API test case generation, connectivity testing with Cohere, and response validation.

## Features

- **Generate Test Cases**: Generates detailed API test cases in Chai.js format based on provided API details and sample responses.
- **Test Cohere API Connectivity**: Endpoint to verify if the Cohere API is working and responding.
- **Validate API Response**: Validates the response structure and content using Cohere API for text generation.
- **Flexible Configuration**: Uses environment variables for sensitive information such as the Cohere API key.

## Prerequisites

- Node.js installed on your machine
- Cohere API key (to be stored in `.env` file)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of your project and add your Cohere API key:

```
COHERE_API_KEY=your-cohere-api-key
```

### 4. Start the server

Run the following command to start the Express server:

```bash
npm start
```

The backend will be available at `http://localhost:5001`.

## API Endpoints

### `POST /generate-test-cases`

Generates API test cases in Chai.js format based on the provided API details.

#### Request body:

```json
{
  "apiDetails": {
    "method": "GET",
    "url": "https://jsonplaceholder.typicode.com/posts",
    "headers": {
      "Authorization": "Bearer mock-token-123456"
    },
    "queryParameters": {}
  },
  "successResponse": [
    {
      "userId": 1,
      "id": 1,
      "title": "Sample title",
      "body": "Sample body content"
    }
  ],
  "errorResponse": {
    "error": "Unauthorized",
    "message": "Invalid token"
  }
}
```

#### Response:

```json
{
  "testCases": "Generated Chai.js test cases"
}
```

### `GET /test-cohere`

Tests the connectivity with the Cohere API. Returns a response indicating whether the Cohere API is working.

#### Response:

```json
{
  "message": "Cohere is working! Response: Hello, Cohere!"
}
```

### `GET /validate-api-response`

Validates the structure and content of an API response using Cohere's text generation capabilities.

#### Response:

```json
{
  "message": "API Response Validation Result: Valid response."
}
```

## Error Handling

- If any error occurs while interacting with the Cohere API or during the test case generation process, a `500` status code is returned with an error message.

## Conclusion

This service helps automate API testing by generating Chai.js test cases and also integrates with Cohere for validating and generating API response structures. The endpoints are flexible and can be customized as per the requirements.

## License

MIT License - See [LICENSE](LICENSE) for more details.
