
const webpush = require('web-push');
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');
require('dotenv').config();

const envPath = path.join(__dirname, '.env');

async function setup() {
    console.log('--- Setting up Push Notifications ---');

    // 1. Generate Keys if not present
    let publicKey = process.env.VAPID_PUBLIC_KEY;
    let privateKey = process.env.VAPID_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
        console.log('Generating new VAPID keys...');
        const vapidKeys = webpush.generateVAPIDKeys();
        publicKey = vapidKeys.publicKey;
        privateKey = vapidKeys.privateKey;

        // Append to .env
        const envContent = fs.readFileSync(envPath, 'utf8');
        const newEnvContent = envContent + `\nVAPID_PUBLIC_KEY=${publicKey}\nVAPID_PRIVATE_KEY=${privateKey}\n`;
        fs.writeFileSync(envPath, newEnvContent);
        console.log('VAPID keys added to .env');
    } else {
        console.log('VAPID keys already exist in .env');
    }

    console.log(`Public Key: ${publicKey}`);

    // 2. Create Database Table
    try {
        const connection = await pool.getConnection();
        console.log('Creating push_subscriptions table...');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        endpoint TEXT NOT NULL,
        keys_p256dh VARCHAR(255) NOT NULL,
        keys_auth VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_subscription (user_id, endpoint(255)),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
        console.log('Table push_subscriptions created/verified.');
        connection.release();
    } catch (err) {
        console.error('Database setup failed:', err);
        process.exit(1);
    }

    // 3. Update public/js/pwa.js with Public Key
    const pwaPath = path.join(__dirname, 'public', 'js', 'pwa.js');
    let pwaContent = fs.readFileSync(pwaPath, 'utf8');

    if (pwaContent.includes('GANTI_DENGAN_VAPID_PUBLIC_KEY_BACKEND_ANDA')) {
        pwaContent = pwaContent.replace(/GANTI_DENGAN_VAPID_PUBLIC_KEY_BACKEND_ANDA/g, publicKey);
        fs.writeFileSync(pwaPath, pwaContent);
        console.log('pwa.js updated with public key.');
    } else {
        console.log('pwa.js seemingly already updated or placeholder not found.');
    }

    console.log('--- Setup Complete ---');
    process.exit(0);
}

setup();
