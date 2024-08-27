const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());

let credentials;

// Load client secrets from a local file
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.error('Error loading client secret file:', err);
    credentials = JSON.parse(content);


    app.listen(port, () => {
        console.log(`oauth backend running on http://localhost:${port}`);
    });
});

// MySQL connection setup
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'customManager'
});

connection.connect();

// Function to store tokens in the database
function storeTokenInDatabase(userId, accessToken, refreshToken) {
    const query = `
        INSERT INTO oauth_tokens (user_id, access_token, refresh_token) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE access_token = ?, refresh_token = ?`;

    connection.query(query, [userId, accessToken, refreshToken, accessToken, refreshToken], (err, results) => {
        if (err) {
            console.error('Error storing tokens:', err);
        } else {
            console.log('Tokens stored successfully');
        }
    });
}

let userId;

app.get('/auth', (req, res) => {
    const { client_secret, client_id, redirect_uris } = credentials;
    userId = req.query.userId;
    console.log(req.query);

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send'],
        state: JSON.stringify({ userId }),
        prompt: 'select_account'
    });

    console.log(authUrl);

    res.json({ authUrl });
});

app.get('/callback', (req, res) => {
    const { code } = req.query;
    const { client_secret, client_id, redirect_uris } = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            return res.status(400).send('Error retrieving access token');
        }

        oAuth2Client.setCredentials(token);

        // Store the token in MySQL database
        // Replace with your own logic to identify the user
        storeTokenInDatabase(userId, token.access_token, token.refresh_token);

        res.redirect('http://localhost/Daniel_Summer_Proj_2024/markup/inside/orderManager.php');
    });
});

// Example route to send an email
app.post('/send-email', (req, res) => {
    const userId = 'user-id-123'; // Replace with your own logic to identify the user

    // Retrieve the token from the database
    connection.query('SELECT access_token, refresh_token FROM oauth_tokens WHERE user_id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Error loading token from database');
        }

        const token = {
            access_token: results[0].access_token,
            refresh_token: results[0].refresh_token
        };

        const { client_secret, client_id, redirect_uris } = credentials;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(token);

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const email = `To: recipient@example.com\n` +
                      `Subject: Test Email\n\n` +
                      `This is a test email sent from a Node.js application!`;

        const encodedEmail = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedEmail,
            },
        }, (err, result) => {
            if (err) return res.status(400).send('The API returned an error: ' + err);
            res.send('Email sent successfully!');
        });
    });
});

module.exports = app;
