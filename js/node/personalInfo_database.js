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
            console.log("password detected");
            const updateQuery = `
            INSERT INTO companies (company_email, company_phone_number, company_name, password_required, password)
            VALUES (?, ?, ?, ?, ?)
            `;

            const updateUserQuery = `
            UPDATE user
            SET company_id = ?, admin_priveledge = ?, company_name = ?
            WHERE id = ?`;

            const getCompanyIdQuery = `
            SELECT * FROM companies
            WHERE company_email = ?`;

            await pool.query(updateQuery, [companyEmail, companyPhoneNumber, companyName, true, passwordHash]);

            const[result, rows] = await pool.query(getCompanyIdQuery, [companyEmail]);
            console.log(result)

            
            await pool.query(updateUserQuery, [result[0].id, true, companyName, userId]);

            
        } else {
            console.log("no password detected");
            const updateQuery = `
            INSERT INTO companies (company_email, company_phone_number, company_name, password_required)
            VALUES (?, ?, ?, ?)
            `;

            const updateUserQuery = `
            UPDATE user
            SET company_id = ?, admin_priveledge = ?, company_name = ?
            WHERE id = ?`;

            const getCompanyIdQuery = `
            SELECT * FROM companies
            WHERE company_email = ?`;
            await pool.query(updateQuery, [companyEmail, companyPhoneNumber, companyName, false]);

            const[result, rows] = await pool.query(getCompanyIdQuery, [companyEmail]);
            console.log(result)

            
            await pool.query(updateUserQuery, [result[0].id, true, companyName, userId]);

        }
        res.send('Company created successfully.')
        
    } catch(error) {
        console.error('Error updating company data:', error);
        res.status(500).send('Error updating company data.');
    }
})

app.post('/edit-company', async (req, res) => {
    const { companyName, companyEmail, companyPhoneNumber, passwordHash, userId, companyId} = req.body;
    console.log(companyEmail, companyName, companyPhoneNumber, passwordHash, userId);


    try {
        if(passwordHash) {
            console.log("password detected");
            const updateQuery = `
            UPDATE companies
            SET company_email = ?, company_phone_number = ?, company_name = ?, password_required = ?, password = ?
            WHERE id = ?`;

            const updateUserQuery = `
            UPDATE user
            SET company_name = ?
            WHERE id = ?`;


            await pool.query(updateQuery, [companyEmail, companyPhoneNumber, companyName, true, passwordHash, companyId]);
            await pool.query(updateUserQuery, [companyName, userId]);

            
        } else {
            const updateQuery = `
            UPDATE companies
            SET company_email = ?, company_phone_number = ?, company_name = ?, password_required = ?, password = ?
            WHERE id = ?`;

            const updateUserQuery = `
            UPDATE user
            SET company_name = ?
            WHERE id = ?`;


            await pool.query(updateQuery, [companyEmail, companyPhoneNumber, companyName, false, null, companyId]);
            await pool.query(updateUserQuery, [companyName, userId]);

        }
        res.send('Company updated successfully.')
        
    } catch(error) {
        console.error('Error updating company data:', error);
        res.status(500).send('Error updating company data.');
    }
})

app.get('/query-companies', async (req, res) => {
    try {
        const companyDataQuery = 'SELECT id, company_name, password_required, password FROM companies';
        const[result, rows] = await pool.query(companyDataQuery);


        res.status(200).json(result);

    } catch(error) {
        console.error('Error retrieving company data:', error)
        res.status(500).send('Error retrieving company data.')
    }
})

app.post('/join-company', async (req, res) => {
    const { userId, companyId, companyName } = req.body;
    try {
        const updateUserQuery = `
            UPDATE user
            SET company_id = ?, admin_priveledge = ?, company_name = ?
            WHERE id = ?`;
        
        await pool.query(updateUserQuery, [companyId, false, companyName, userId]);

        res.status(200).send('Company joined successfully.')
    } catch (error) {
        console.error('Error updating data:', error)
        res.status(500).send('Error updating data.')
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
