const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load secrets from the .env file
require('dotenv').config();

const PORT = 3000;

// SECURE BACKEND STORAGE: Secret is safely loaded from the environment!
const DIRECT_LINE_SECRET = process.env.DIRECT_LINE_SECRET;

// Function to call Microsoft's API and exchange the Secret for a Temporary Token
function generateDirectLineToken() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'directline.botframework.com',
            path: '/v3/directline/tokens/generate',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIRECT_LINE_SECRET}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data).token);
                } else {
                    reject(new Error(`Failed to get token: ${res.statusCode}`));
                }
            });
        });

        req.on('error', error => reject(error));
        req.end();
    });
}

// Create a simple web server
const server = http.createServer(async (req, res) => {
    
    // 1. Serve the secure Token Endpoint
    if (req.url === '/api/getDirectLineToken' && req.method === 'GET') {
        try {
            const token = await generateDirectLineToken();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: token }));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to generate token' }));
        }
        return;
    }

    // 2. Serve the HTML frontend
    let filePath = path.join(__dirname, req.url === '/' ? 'chatbot.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Bind to a static port so Azure AD Redirect URIs don't constantly break
server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` SECURE CHATBOT SERVER RUNNING`);
    console.log(`======================================================`);
    console.log(` Please open your browser to: http://localhost:${PORT}/`);
    console.log(` The master secret is now securely hidden on the server!`);
    console.log(`======================================================\n`);
});
