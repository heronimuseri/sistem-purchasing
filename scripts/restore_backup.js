const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const backupFile = path.join(__dirname, '../full_backup.json');
const logFile = path.join(__dirname, '../restore.log');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function restore() {
    let connection;
    try {
        log("📂 Reading backup file...");
        if (!fs.existsSync(backupFile)) {
            throw new Error("Backup file not found!");
        }
        const data = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

        connection = await pool.getConnection();
        log("✅ Connected to database.");

        // 1. Users
        if (data.users && data.users.length > 0) {
            log(`Processing ${data.users.length} users...`);
            for (const user of data.users) {
                try {
                    await connection.query(`
                        INSERT IGNORE INTO users (id, name, company, user, pass, role, wa_number)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [user.id, user.name, user.company, user.user, user.pass, user.role, user.wa_number]);
                } catch (e) {
                    log(`❌ Error User ${user.id}: ${e.message}`);
                }
            }
            log("  - Users done.");
        }

        // 2. Vendors
        if (data.vendors && data.vendors.length > 0) {
            log(`Processing ${data.vendors.length} vendors...`);
            for (const v of data.vendors) {
                try {
                    await connection.query(`
                    INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [v.id, v.kode, v.nama, v.pic || '', v.no_hp || '', v.alamat || '', v.created_at ? new Date(v.created_at) : new Date(), v.updated_at ? new Date(v.updated_at) : new Date()]);
                } catch (e) {
                    log(`❌ Error Vendor ${v.id}: ${e.message}`);
                }
            }
            log("  - Vendors done.");
        }

        // 3. PR Counters
        if (data.pr_counters && data.pr_counters.length > 0) {
            log(`Processing PR Counters...`);
            for (const c of data.pr_counters) {
                try {
                    await connection.query(`INSERT IGNORE INTO pr_counters (year, last_seq) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_seq = VALUES(last_seq)`, [c.year, c.last_seq]);
                } catch (e) {
                    log(`❌ Error Counter ${c.year}: ${e.message}`);
                }
            }
        }

        // 4. Purchase Requests
        if (data.purchase_requests && data.purchase_requests.length > 0) {
            log(`Processing ${data.purchase_requests.length} PRs...`);
            for (const pr of data.purchase_requests) {
                try {
                    const tanggal = new Date(pr.tanggal);

                    await connection.query(`
                    INSERT IGNORE INTO purchase_requests 
                    (id, pr_no, tanggal, requester_id, requester_name, departemen, keperluan, status, ktu_name, approval_ktu_date, manager_name, approval_manager_date, reject_reason, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                        pr.id,
                        pr.pr_no,
                        tanggal,
                        pr.requester_id,
                        pr.requester_name,
                        pr.departemen,
                        pr.keperluan,
                        pr.status,
                        pr.ktu_name || null,
                        pr.approval_ktu_date ? new Date(pr.approval_ktu_date) : null,
                        pr.manager_name || null,
                        pr.approval_manager_date ? new Date(pr.approval_manager_date) : null,
                        pr.rejection_reason || pr.reject_reason || null,
                        pr.created_at ? new Date(pr.created_at) : new Date()
                    ]);
                } catch (e) {
                    log(`❌ Error PR ${pr.id}: ${e.message}`);
                }
            }
            log("  - PRs done.");
        }

        // 5. PR Items
        if (data.pr_items && data.pr_items.length > 0) {
            log(`Processing ${data.pr_items.length} PR Items...`);
            for (const item of data.pr_items) {
                try {
                    await connection.query(`
                    INSERT IGNORE INTO pr_items (id, pr_id, material, spesifikasi, qty, satuan, keterangan)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [item.id, item.pr_id, item.material, item.spesifikasi || '', item.qty, item.satuan, item.keterangan || '']);
                } catch (e) {
                    log(`❌ Error Item ${item.id}: ${e.message}`);
                }
            }
            log("  - PR Items done.");
        }

        log("🏁 Restore completed successfully!");

    } catch (error) {
        log("❌ Restore Global Error: " + error.message);
    } finally {
        if (connection) connection.release();
        pool.end();
    }
}

restore();
