// server.js

// Import the necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

// Convert fs.readFile and fs.writeFile into Promises
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Initialize an instance of express
const app = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing application/json
app.use(express.json());

// Middleware to serve static files from 'public' directory
app.use(express.static('public'));

// API Routes

// GET route for fetching all the notes from the 'db.json' file
app.get('/api/notes', async (req, res) => {
  try {
    const data = await readFileAsync('./db/db.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Error reading notes data" });
  }
});

// POST route for saving a new note to the 'db.json' file
app.post('/api/notes', async (req, res) => {
  try {
    const notes = JSON.parse(await readFileAsync('./db/db.json', 'utf8'));
    const newNote = { ...req.body, id: uuidv4() };
    notes.push(newNote);
    await writeFileAsync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Error writing new note" });
  }
});

// Optional DELETE route for bonus challenge
// app.delete('/api/notes/:id', async (req, res) => {
//   try {
//     let notes = JSON.parse(await readFileAsync('./db/db.json', 'utf8'));
//     notes = notes.filter(note => note.id !== req.params.id);
//     await writeFileAsync('./db/db.json', JSON.stringify(notes));
//     res.json({ message: 'Note deleted' });
//   } catch (err) {
//     res.status(500).json({ error: "Error deleting note" });
//   }
// });

// HTML Routes

// Route to serve the 'notes.html' file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to serve the 'index.html' file as a default
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and have it listen on the defined PORT
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
