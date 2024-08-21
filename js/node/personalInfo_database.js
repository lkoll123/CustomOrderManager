const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());// Parse JSON request bodies
app.use(cors());

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'customManager'
}).promise();




app.post('/update-user', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, userId } = req.body;
    console.log(firstName, lastName, email, phoneNumber, userId)

    try {
        const updateQuery = `
            UPDATE user 
            SET first_name = ?, last_name = ?, email = ?, phone_number = ? 
            WHERE id = ?`;
        
        await pool.query(updateQuery, [firstName, lastName, email, phoneNumber, userId]);
        console.log('query executed successfully');
        res.send('User information updated successfully.');
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send('Error updating user data.');
    }
});

app.post('/create-company', async (req, res) => {
    const { companyName, companyEmail, companyPhoneNumber, passwordHash, userId} = req.body;
    console.log(companyEmail, companyName, companyPhoneNumber, passwordHash, userId);

    try {
        if(passwordHash) {
            const updateQuery = `
            INSERT INTO companies (company_email, company_phone_number, company_name, password_required, password)
            VALUES (?, ?, ?, ?, ?)
            `;

            const updateUserQuery = `
            UPDATE user
            SET company_id = ?, admin_privelege = ?, company_name = ?
            WHERE id = ?`;

            const getCompanyIdQuery = `
            SELECT id FROM companies
            WHERE email = ?`;

            const[result, rows] = await pool.query(getCompanyIdQuery, companyEmail);
            console.log(result.id)

            await pool.query(updateQuery, [companyEmail, companyPhoneNumber, companyName, true, passwordHash]);
            await pool.query(updateUserQuery, [result.id, true, companyName, userId]);

            
        } else {
            const updateQuery = `
            INSERT INTO companies (company_email, company_phone_number, company_name, password_required)
            VALUES (?, ?, ?, ?)
            `;

            const updateUserQuery = `
            UPDATE user
            SET company_id = ?, admin_privelege = ?, company_name = ?
            WHERE id = ?`;

            const getCompanyIdQuery = `
            SELECT id FROM companies
            WHERE email = ?`;

            const[result, rows] = await pool.query(getCompanyIdQuery, companyEmail);
            console.log(result.id)

            await pool.query(updateQuery, [companyEmail, companyPhoneNumber, companyName, true]);
            await pool.query(updateUserQuery, [result.id, true, companyName, userId]);

        }
        res.send('Company created successfully.')
        
    } catch {
        console.error('Error updating company data:', error);
        res.status(500).send('Error updating company data.');
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
