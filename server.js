const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

// Helper function to parse POST data
function parsePostData(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoint for greeting users
    if (pathname === '/api/greet' && method === 'POST') {
        parsePostData(req, (error, data) => {
            if (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
                return;
            }

            const { name } = data;
            
            if (!name || name.trim() === '') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Please enter your name!' 
                }));
                return;
            }
            
            // Generate time-based greeting
            const hour = new Date().getHours();
            let timeGreeting;
            
            if (hour < 12) {
                timeGreeting = 'Good morning';
            } else if (hour < 18) {
                timeGreeting = 'Good afternoon';
            } else {
                timeGreeting = 'Good evening';
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: `${timeGreeting}, ${name}! Welcome to our website 🎉`,
                timestamp: new Date().toLocaleString()
            }));
        });
        return;
    }

    // API endpoint to get server info
    if (pathname === '/api/info' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            server: 'Node.js HTTP Server',
            version: '1.0.0',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // Serve static files
    let filePath = pathname === '/' ? './index.html' : `.${pathname}`;
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Page not found',
                    path: pathname 
                }));
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('🔥 Node.js backend is ready!');
});
