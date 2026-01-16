
const express = require('express');
const router = express.Router();
const pool = require('../db');
const webpush = require('web-push');

// Configure web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@sistem-purchasing.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

// Subscribe Route
router.post('/subscribe', async (req, res) => {
    const subscription = req.body;
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { endpoint, keys } = subscription;
        await pool.query(`
            INSERT INTO push_subscriptions (user_id, endpoint, keys_p256dh, keys_auth)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE keys_p256dh = VALUES(keys_p256dh), keys_auth = VALUES(keys_auth)
        `, [userId, endpoint, keys.p256dh, keys.auth]);

        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ success: false, message: 'Failed to subscribe' });
    }
});

// Helper function to send notification to a user or role
// We export this to be used by other routes
const sendPushToUser = async (userId, payload) => {
    try {
        const [subs] = await pool.query('SELECT * FROM push_subscriptions WHERE user_id = ?', [userId]);
        const notifications = subs.map(sub => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.keys_p256dh,
                    auth: sub.keys_auth
                }
            };
            return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
                .catch(err => {
                    if (err.statusCode === 410) {
                        // Subscription expired/gone, delete it
                        pool.query('DELETE FROM push_subscriptions WHERE id = ?', [sub.id]);
                    }
                    console.error('Push send error:', err);
                });
        });
        await Promise.all(notifications);
    } catch (err) {
        console.error('Error sending push to user:', err);
    }
};

const sendPushToRole = async (role, payload) => {
    try {
        const [users] = await pool.query('SELECT id FROM users WHERE role = ?', [role]);
        for (const user of users) {
            await sendPushToUser(user.id, payload);
        }
    } catch (err) {
        console.error('Error sending push to role:', err);
    }
};

module.exports = {
    router,
    sendPushToUser,
    sendPushToRole
};
