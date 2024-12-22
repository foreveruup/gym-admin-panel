const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'amir',
    host: 'localhost',
    database: 'gymDatabase',
    password: 'f0reverup',
    port: 5432,
});

// 1. Sorted list of members
app.get('/members', async (req, res) => {
    const { sort } = req.query;
    const query = `SELECT * FROM members ORDER BY ${sort || 'name'} ASC`;
    const { rows } = await pool.query(query);
    res.json(rows);
});

app.get('/trainers', async (req, res) => {
    const { sort } = req.query;
    const query = `SELECT * FROM trainers ORDER BY ${sort || 'name'} ASC`;
    const { rows } = await pool.query(query);
    res.json(rows);
});

// 2. Display data from a table
app.get('/classes', async (req, res) => {
    const query = 'SELECT * FROM classes';
    const { rows } = await pool.query(query);
    res.json(rows);
});

// 3. Query with parameter
app.get('/members/:membershipType', async (req, res) => {
    const { membershipType } = req.params;
    const query = 'SELECT * FROM members WHERE members.membership_type = $1';
    const { rows } = await pool.query(query, [membershipType]);
    res.json(rows);
});

// 4. Query with calculated fields
app.get('/class-stats', async (req, res) => {
    const query = `
    SELECT c.name, COUNT(m.id) as member_count, c.capacity,
           (c.capacity - COUNT(m.id)) as available_spots
    FROM classes c
    LEFT JOIN memberships m ON c.id = m.class_id
    GROUP BY c.id, c.name, c.capacity
  `;
    const { rows } = await pool.query(query);
    res.json(rows);
});

// 5. Query with totals
app.get('/equipment-summary', async (req, res) => {
    const query = `
    SELECT 
      COUNT(*) as total_items,
      SUM(quantity) as total_quantity,
      AVG(quantity) as average_quantity
    FROM equipment
  `;
    const { rows } = await pool.query(query);
    res.json(rows[0]);
});

// 6. Cross query
app.get('/trainer-class-count', async (req, res) => {
    const query = `
    SELECT t.name as trainer_name, COUNT(c.id) as class_count
    FROM trainers t
    LEFT JOIN classes c ON t.id = c.trainer_id
    GROUP BY t.id, t.name
  `;
    const { rows } = await pool.query(query);
    res.json(rows);
});

// 7. Data modification queries
app.post('/members', async (req, res) => {
    const { name, email, join_date, membership_type } = req.body;
    const query = 'INSERT INTO members (name, email, join_date, membership_type) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [name, email, join_date, membership_type]);
    res.json(rows[0]);
});

app.put('/members/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, join_date, membership_type } = req.body;
    const query = 'UPDATE members SET name = $1, email = $2, join_date = $3, membership_type = $4 WHERE id = $5 RETURNING *';
    const { rows } = await pool.query(query, [name, email, join_date, membership_type, id]);
    res.json(rows[0]);
});

app.delete('/members/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM members WHERE id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Member deleted successfully' });
});


app.post('/trainers', async (req, res) => {
    const { name, specialization, email } = req.body;
    const query = 'INSERT INTO trainers (name, specialization, email) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [name, specialization, email]);
    res.json(rows[0]);
});

app.put('/trainers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, specialization } = req.body;
    const query = 'UPDATE trainers SET name = $1, specialization = $2, email = $3 WHERE id = $4 RETURNING *';
    const { rows } = await pool.query(query, [name, specialization, email, id]);
    res.json(rows[0]);
});

app.delete('/trainers/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM trainers WHERE id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Trainer deleted successfully' });
});


// 8. Search
app.get('/search', async (req, res) => {
    const { keyword } = req.query;
    const query = `
    SELECT * FROM members 
    WHERE name ILIKE $1 OR email ILIKE $1 OR membership_type ILIKE $1
  `;
    const { rows } = await pool.query(query, [`%${keyword}%`]);
    res.json(rows);
});

// 9. Using Function
app.get('/active-membership/:memberId', async (req, res) => {
    const { memberId } = req.params;

    try {
        const query = 'SELECT is_membership_active($1) AS is_active';
        const { rows } = await pool.query(query, [memberId]);
        res.json(rows[0]); // Отправляем результат на фронт
    } catch (error) {
        console.error('Error checking membership status:', error);
        res.status(500).json({ error: 'Failed to check membership status' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

