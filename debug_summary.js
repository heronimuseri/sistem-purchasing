
const pool = require('./db');
require('dotenv').config();

async function checkData() {
    try {
        const [rows] = await pool.query("SELECT id, status FROM purchase_requests");
        console.log("Total Rows:", rows.length);
        console.log("Statuses:", rows.map(r => r.status));

        const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending KTU Approval' THEN 1 ELSE 0 END) as pending_ktu,
        SUM(CASE WHEN status = 'Pending Manager Approval' THEN 1 ELSE 0 END) as pending_manager,
        SUM(CASE WHEN status = 'Fully Approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
      FROM purchase_requests
    `;
        const [summary] = await pool.query(query);
        console.log("Summary Query Result:", summary[0]);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
