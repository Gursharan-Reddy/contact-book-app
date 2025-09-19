const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add a root route for basic health check
app.get('/', (req, res) => {
  res.send('Contact Book API is running!');
});

app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, phone], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email, phone });
  });
});

app.get('/contacts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchTerm = req.query.q || '';
  const offset = (page - 1) * limit;

  const searchPattern = `%${searchTerm}%`;
  const whereClause = `WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?`;
  const params = [searchPattern, searchPattern, searchPattern];

  const countSql = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
  db.get(countSql, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const total = row.total;
    const totalPages = Math.ceil(total / limit);
    const dataSql = `SELECT * FROM contacts ${whereClause} ORDER BY name LIMIT ? OFFSET ?`;
    db.all(dataSql, [...params, limit, offset], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ contacts: rows, total, page, totalPages });
    });
  });
});

app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM contacts WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});