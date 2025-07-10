// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('posts.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

const app = express();
app.use(bodyParser.json());
app.use(require('cors')());

// API Endpoints
app.get('/posts', (req, res) => {
  db.all("SELECT * FROM posts ORDER BY timestamp DESC", (err, rows) => {
    res.json(rows);
  });
});

app.post('/posts', (req, res) => {
  db.run("INSERT INTO posts (content) VALUES (?)", [req.body.content], function() {
    res.json({ id: this.lastID });
  });
});

app.listen(3000, () => console.log('Server running'));
