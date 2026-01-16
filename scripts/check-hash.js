const bcrypt = require('bcrypt');

const hash = '$2b$10$rKN3r9O5QZv0d7Xz8V2pZuQxj3KzW5r6yVvGpM1wH8nL4jC0eF2Ki';
const pass = 'admin123';

bcrypt.compare(pass, hash).then(match => {
    console.log(`Password: ${pass}`);
    console.log(`Hash: ${hash}`);
    console.log(`Match: ${match}`);
});
