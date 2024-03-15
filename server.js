// Import the express module
const express = require('express');

// Create an instance of express
const app = express();

// Define a port to listen for incoming requests
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from 'public' directory
app.use(express.static('public'));

// Start the server on the defined PORT
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})