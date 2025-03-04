const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Database connection error", err));

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW();");
        res.json({ message: "Database connected", time: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.post('/notes', async (req, res) => {
    const { content } = req.body; 

    if (!content) {
        return res.status(400).send("Content is required");
    }

    try {
        const result = await pool.query(
            "INSERT INTO notes (content) VALUES ($1) RETURNING *", 
            [content]
        );
        res.status(201).json(result.rows[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get('/notes', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notes WHERE is_deleted = FALSE ORDER BY created_at"
        );
        res.json(result.rows);  
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


app.put('/notes/complete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE notes SET status = 'completed' WHERE id = $1", 
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Note not found");
        }

        res.send("Note marked as completed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.put('/notes/active/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE notes SET status = 'active' WHERE id = $1", 
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Note not found");
        }

        res.send("Note marked as completed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.put('/notes/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE notes SET is_deleted = TRUE WHERE id = $1", 
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Note not found");
        }

        res.send("Note marked as deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1", 
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Note not found");
        }

        res.send("Note deleted permanently");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});






