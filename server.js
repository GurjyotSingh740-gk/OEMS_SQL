// Import necessary packages
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors'); // Import the cors package

// Initialize Express app
const app = express();
const PORT = 3000;

// Enable CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Adjust to your frontend’s origin
}));

// Middleware to parse JSON data (necessary for reading req.body in JSON format)
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname)));

// Set up PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',         // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'events_data',      // The database name
    password: 'Hello,2#*', // Replace with your PostgreSQL password
    port: 5432,
});

// Route to fetch event data from PostgreSQL and send to the frontend
app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

// Route to add a new event
app.post('/api/events', async (req, res) => {
    const { title, event_date, location, capacity, description } = req.body;

    // Validate input data
    if (!title || !event_date || !location || !capacity || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `
            INSERT INTO events (title, event_date, location, description, capacity)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [title, event_date, location, description, capacity];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]); // Send the created event back as response
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Route to fetch event data based on title from PostgreSQL and send to the frontend
app.get('/api/events', async (req, res) => {
    const { title } = req.query; // Get title from query parameters
    
    if (!title) {
        return res.status(400).json({ error: 'Event title is required' });
    }

    try {
        // Query the database to find an event matching the title
        const query = `
            SELECT * FROM events
            WHERE LOWER(title) = LOWER($1);  // Case-insensitive search
        `;
        const result = await pool.query(query, [title]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]); // Return the first event that matches the title
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve event' });
    }
});


// Route to delete an event by title
app.delete('/api/events/title/:title', async (req, res) => {
    const { title } = req.params;

    // Validate if title is present
    if (!title) {
        return res.status(400).json({ error: 'Event title is required' });
    }

    try {
        // Perform case-insensitive matching to ensure a title can be deleted regardless of case
        const query = `
            DELETE FROM events
            WHERE LOWER(title) = LOWER($1)  // Case-insensitive comparison
            RETURNING *;
        `;
        
        const result = await pool.query(query, [title]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found with that title' });
        }

        // Successfully deleted event
        res.json({ message: 'Event deleted successfully', event: result.rows[0] });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
