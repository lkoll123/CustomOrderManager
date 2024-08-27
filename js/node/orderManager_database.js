const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'customManager'
}).promise();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON data from the body

// GET endpoint
app.get('/query-customers', async (req, res) => {
    console.log(req.query);
    const { companyId } = req.query;
    console.log(companyId);

    try {
        const customerQuery = `
        SELECT customer_id, customer_name, customer_email, customer_bio 
        FROM customers
        WHERE company_id = ?`;
        const [result] = await pool.query(customerQuery, [companyId]);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving company:', error);
        res.status(400).send('Error Retrieving Company');
    }
});

// POST endpoint
app.post('/add-customer', async (req, res) => {
    const { name, email, bio, companyId } = req.body;
    console.log(req.body);
    console.log(name, email, bio, companyId);
    try {
        const updateQuery = `
        INSERT INTO customers (customer_name, customer_email, customer_bio, company_id)
        VALUES (?, ?, ?, ?)`;
        await pool.query(updateQuery, [name, email, bio, companyId]);
        res.status(200).send('Customer added successfully');
    } catch (error) {
        console.error('Error updating company data:', error);
        res.status(400).send('Error Updating Company Data');
    }
});

// Server setup
app.listen(3001, () => {
    console.log("orderManager is running on http://localhost:3001");
});

module.exports = app;
