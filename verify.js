
const http = require('http');

console.log('Testing http://localhost:3000/ ...');

http.get('http://localhost:3000/', (res) => {
    console.log('Status Code:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response length:', data.length);
        if (res.statusCode === 200) {
            console.log('SUCCESS: Page loaded successfully.');
        } else {
            console.log('FAIL: Page returned status', res.statusCode);
        }
    });
}).on('error', (err) => {
    console.error('Error connecting to server:', err.message);
});
