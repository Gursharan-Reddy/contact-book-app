const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./contacts.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Successfully connected to the contacts.db database.');
});

db.serialize(() => {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL
    )
  `;
  db.run(createTableSql);

  const checkSql = `SELECT COUNT(*) as count FROM contacts`;
  db.get(checkSql, (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Contacts table is empty, seeding with initial data...');
      const sampleContacts = [
        { name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890' },
        { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '2345678901' },
        { name: 'Peter Jones', email: 'peter.jones@example.com', phone: '3456789012' },
        { name: 'Mary Johnson', email: 'mary.j@example.com', phone: '4567890123' },
        { name: 'Chris Lee', email: 'chris.lee@example.com', phone: '5678901234' },
        { name: 'Patricia Brown', email: 'pat.brown@example.com', phone: '6789012345' }
      ];

      const insertSql = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
      const stmt = db.prepare(insertSql);

      sampleContacts.forEach(contact => {
        stmt.run(contact.name, contact.email, contact.phone);
      });

      stmt.finalize();
      console.log('Sample contacts have been added.');
    }
  });
});

module.exports = db;