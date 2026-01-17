
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
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

// Endpoint untuk notifikasi count
router.get("/count", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { role } = req.session.user;
        let query = "";
        let values = [];

        if (role === "ktu") {
            query =
                "SELECT COUNT(*) as pendingCount FROM purchase_requests WHERE status = ?";
            values = ["Pending KTU Approval"];
        } else if (role === "manager") {
            query =
                "SELECT COUNT(*) as pendingCount FROM purchase_requests WHERE status = ?";
            values = ["Pending Manager Approval"];
        } else if (role === "manager_ho") {
            query =
                "SELECT COUNT(*) as pendingCount FROM purchase_orders WHERE status = ?";
            values = ["Pending Manager HO Approval"];
        } else if (role === "direktur") {
            query =
                "SELECT COUNT(*) as pendingCount FROM purchase_orders WHERE status = ?";
            values = ["Pending Direktur Approval"];
        } else {
            return res.json({ pendingCount: 0 });
        }

        const [result] = await pool.query(query, values);
        res.json({ pendingCount: result[0].pendingCount });
    } catch (error) {
        console.error("Error fetching notification count:", error);
        res.json({ pendingCount: 0 });
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
