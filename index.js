// Import required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();  // Ensure to load environment variables from .env file

const app = express();
const port = 5001;


const corsOptions = {
  origin: 'https://apitestcases.netlify.app', // Allow requests from this origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());

// API Request Details
const apiDetails = {
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/posts",
  headers: { Authorization: "Bearer mock-token-123456" },
  queryParameters: {}
};

// Sample Responses
const successResponse = [
  {
    userId: 1,
    id: 1,
    title: "Sample title",
    body: "Sample body content"
  }
];

const errorResponse = {
  error: "Unauthorized",
  message: "Invalid token"
};

// Route to Generate Test Cases
app.post("/generate-test-cases", async (req, res) => {
    const prompt = `Generate detailed API test cases in Chai.js format for the following API details:

    API Request Details:
    - **Method**: ${apiDetails.method} 
    - **URL**: ${apiDetails.url}
    - **Headers**: ${JSON.stringify(apiDetails.headers, null, 2)}
    - **Query Parameters**: ${JSON.stringify(apiDetails.queryParameters, null, 2)}
    
    Sample Response Details:
    - **Sample Success Response**: 
    \`\`\`
    ${JSON.stringify(successResponse, null, 2)}
    \`\`\`
    - **Sample Error Response**: 
    \`\`\`
    ${JSON.stringify(errorResponse, null, 2)}
    \`\`\`
    
    Test Case Validation Criteria:
    
    1. **Status Code Validation**: 
       - Validate that the correct status code is returned for various scenarios (e.g., 200 OK, 404 Not Found, 401 Unauthorized).
       - Example: \`chai.expect(response.status).to.equal(200);\`
    
    2. **Response Body Validation**:
       - Ensure that the response body contains the necessary fields, and validate their data types (e.g., string, number, array).
       - Example: \`chai.expect(response.body).to.have.property('fieldName');\`
       - If applicable, check for specific values or patterns in the fields.
    
    3. **Error Handling Validation**:
       - Ensure that appropriate error responses are returned for invalid requests (e.g., missing parameters, unauthorized access).
       - Example: \`chai.expect(response.body.message).to.equal('Unauthorized');\`
    
    4. **Header Validation**:
       - Validate the presence of key headers in the response (e.g., Content-Type, Authorization).
       - Example: \`chai.expect(response.headers).to.have.property('Content-Type');\`
    
    5. **Performance Validation** (if applicable):
       - Ensure that the response times are within acceptable thresholds.
       - Example: \`chai.expect(response.duration).to.be.lessThan(200);\`
    
    6. **Test Case Types**:
       - **Positive Test Cases**: Valid requests and expected correct responses (e.g., testing with valid parameters).
       - **Negative Test Cases**: Invalid requests (e.g., missing parameters, incorrect data, or unauthorized requests).
       - **Error Handling Test Cases**: Testing how the API responds to different error conditions (e.g., 404, 500, invalid token).
       - **Boundary Test Cases**: Test edge values (e.g., very large/small numbers, long strings).
       - **Performance Test Cases**: Test response times and scalability (optional, if relevant).
    
    Test Case Structure:
    Each test case should follow this format:
    1. **Test Case Description**: Brief description of the scenario (e.g., "Verify the API returns a 200 OK status code").
    2. **Expected Result**: Clear and concise expected outcome (e.g., "Status code should be 200").
    3. **Test Assertion**: The Chai.js assertion that checks the expected result (e.g., \`chai.expect(response.status).to.equal(200);\`).
    
    Please generate test cases in Chai.js format for the provided API details, ensuring that all the above validation criteria are covered.
    `;    
  
    try {
      // Send request to Cohere API for text generation
      const response = await axios.post(
        "https://api.cohere.ai/v1/generate",  // Cohere API endpoint for text generation
        {
          prompt: prompt,
          max_tokens: 1500
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      // Log and extract the generated test cases
      const generatedTestCases = response.data?response.data.generations[0].text : "No test cases generated.";
      console.log("Cohere Generated Test Cases:", generatedTestCases);  // Log for debugging
  
      // Send the extracted test cases as the response
      res.json({ testCases: generatedTestCases });
    } catch (error) {
      console.error("Error generating test cases:", error.message);
      res.status(500).send("Failed to generate test cases.");
    }
  });
  

// Route to Test Cohere API Connectivity
app.get("/test-cohere", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        prompt: "Hello, Cohere! Are you working?",
        max_tokens: 50
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Log the response for debugging
    console.log("Cohere Response:", response.data ? response.data : "No Response");
    // Formulate the response message
    const message = response.data ? response.data.generations[0].text : "No response from Cohere.";
    res.json({ message: `Cohere is working! Response: ${message}` });
  } catch (error) {
    console.error("Error connecting to Cohere:", error.message);
    res.status(500).json({ error: `Failed to connect to Cohere API. Error: ${error.message}` });
  }
});

// Route to Validate API Response (Sample Use Case)
app.get("/validate-api-response", async (req, res) => {
  try {
    // Call the Cohere API to validate the response
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        prompt: "Validate the response structure and content",
        max_tokens: 100
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Log the response for debugging
    console.log("API Validation Response:", response.data ? response.data.generations[0].text : "No Response");

    // Formulate the response message
    const message = response.data ? response.data.generations[0].text : "No response from Cohere.";
    res.json({ message: `API Response Validation Result: ${message}` });
  } catch (error) {
    console.error("Error validating API response:", error.message);
    res.status(500).json({ error: `Failed to validate API response. Error: ${error.message}` });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
