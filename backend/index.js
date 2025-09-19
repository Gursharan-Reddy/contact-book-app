// --- Imports ---
const express = require('express');
const cors = require('cors');
const db = require('./database');

// --- Initialization ---
const app = express();
const PORT = 5000;

// --- ** IMPORTANT CORS FIX ** ---
// We are explicitly telling the server to allow requests from your live frontend URL.
const corsOptions = {
  origin: "https://contact-book-app-three.vercel.app"
};
app.use(cors(corsOptions));
// --- ** END OF FIX ** ---


// --- Middleware ---
app.use(express.json());

// --- API Endpoints ---

/**
 * @route   POST /contacts
 * @desc    Add a new contact
 */
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'All fields (name, email, phone) are required' });
  }

  const sql = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
  
  db.run(sql, [name, email, phone], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email, phone });
  });
});

// ... (The rest of your GET and DELETE endpoints remain the same) ...

/**
 * @route   GET /contacts
 * @desc    Get contacts with pagination and search
 */
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
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    const total = row.total;
    const totalPages = Math.ceil(total / limit);

    const dataSql = `SELECT * FROM contacts ${whereClause} ORDER BY name LIMIT ? OFFSET ?`;
    
    db.all(dataSql, [...params, limit, offset], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({
        contacts: rows,
        total,
        page,
        totalPages,
      });
    });
  });
});

/**
 * @route   DELETE /contacts/:id
 * @desc    Delete a contact by ID
 */
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM contacts WHERE id = ?`;

  db.run(sql, id, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  });
});


// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});