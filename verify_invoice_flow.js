const axios = require('axios');
const pool = require('./db');

// Config
const BASE_URL = 'http://localhost:3000/api';
const USER_ADMIN = { company: 'PT SPA', user: 'admin', password: 'admin123' };

// Cookie jar for session
let cookie = '';

async function login(creds) {
    try {
        const res = await axios.post(BASE_URL + '/login', creds);
        const setCookie = res.headers['set-cookie'];
        if (setCookie) {
            cookie = setCookie[0].split(';')[0];
        }
        return res.data;
    } catch (e) {
        console.error('Login failed:', e.response ? e.response.data : e.message);
        throw e;
    }
}

async function get(path) {
    const res = await axios.get(BASE_URL + path, { headers: { Cookie: cookie } });
    return res.data;
}

async function post(path, data) {
    const res = await axios.post(BASE_URL + path, data, { headers: { Cookie: cookie } });
    return res.data;
}

async function put(path, data = {}) {
    const res = await axios.put(BASE_URL + path, data, { headers: { Cookie: cookie } });
    return res.data;
}

async function runFlow() {
    console.log("=== STARTING INVOICE FLOW VERIFICATION ===");

    // 1. Login as Admin (Simplification: Admin has all roles/permissions for test)
    // Ideally we should switch users, but 'admin' role has access to everything in this system.
    await login(USER_ADMIN);
    console.log("1. Login Success");

    // Check Session
    const session = await get('/session');
    console.log("Session User:", session.user);

    // 2. Create PR (Prerequisite)
    const prData = {
        tanggal: '2026-01-20',
        keperluan: 'Test Invoice Flow',
        departemen: 'IT',
        items: [{ material: 'Laptop', qty: 2, satuan: 'Unit' }]
    };
    const prRes = await post('/requests', prData);
    const prNoStr = prRes.message.match(/PR #(.+) berhasil/)[1];

    // Get PR ID
    const prList = await get('/requests');
    const pr = prList.find(p => p.pr_no === prNoStr);
    console.log(`2. PR Created: ${pr.pr_no} (ID: ${pr.id})`);

    // 3. Approve PR (KTU & Manager)
    await post(`/requests/${pr.id}/approve`); // KTU
    await post(`/requests/${pr.id}/approve`); // Manager
    console.log("3. PR Fully Approved");

    // 4. Create PO (Prerequisite)
    // Get Vendor ID
    const vendors = await get('/po/vendors'); // Now using shared endpoint check!
    const vendorId = vendors.data[0].id; // Pick first vendor

    const poData = {
        pr_id: pr.id,
        vendor_id: vendorId,
        tanggal: '2026-01-21',
        include_ppn: true,
        items: [{ material: 'Laptop', qty: 2, satuan: 'Unit', harga_satuan: 10000000 }]
    };
    const poRes = await post('/po', poData);
    const po = poRes.data;
    console.log(`4. PO Created: ${po.po_no} (ID: ${po.id})`);

    // 5. Approve PO (Mgr HO & Direktur)
    await put(`/po/${po.id}/approve-manager-ho`);
    await put(`/po/${po.id}/approve-direktur`);
    console.log("5. PO Approved");

    // 6. Create Invoice (The actual test target)
    console.log("--- TESTING INVOICE CREATION ---");
    const invData = {
        vendor_id: vendorId,
        periode: 'Jan 2026',
        nama_rekening: 'PT Vendor',
        no_rekening: '123456789',
        nama_bank: 'BCA',
        keterangan_pembayaran: 'Payment for Laptops',
        tanggal: '2026-01-25',
        jatuh_tempo: '2026-02-25',
        subtotal: 20000000,
        ppn: 2200000,
        total: 22200000,
        po_ids: [po.id]
    };
    const invRes = await post('/invoices', invData);
    const inv = invRes.data;
    console.log(`6. Invoice Created: ${inv.invoice_no} (ID: ${inv.id})`);

    // Verify Status: Pending Manager HO
    let invDetail = (await get(`/invoices/${inv.id}`)).data;
    if (invDetail.status !== 'Pending Manager HO') throw new Error(`Status mismatch. Expected 'Pending Manager HO', got '${invDetail.status}'`);
    console.log("   Status Valid: Pending Manager HO");

    // 7. Approve Manager HO
    console.log("--- TESTING MGR HO APPROVAL ---");
    await put(`/invoices/${inv.id}/approve-manager-ho`);
    invDetail = (await get(`/invoices/${inv.id}`)).data;
    if (invDetail.status !== 'Pending Direktur') throw new Error(`Status mismatch. Expected 'Pending Direktur', got '${invDetail.status}'`);
    console.log("   Status Valid: Pending Direktur");

    // 8. Approve Direktur
    console.log("--- TESTING DIREKTUR APPROVAL ---");
    await put(`/invoices/${inv.id}/approve-direktur`);
    invDetail = (await get(`/invoices/${inv.id}`)).data;
    if (invDetail.status !== 'Approved') throw new Error(`Status mismatch. Expected 'Approved', got '${invDetail.status}'`);
    console.log("   Status Valid: Approved");

    console.log("=== VERIFICATION SUCCESS ===");
}

runFlow().catch(err => {
    console.error("VERIFICATION FAILED");
    if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
        console.error(err);
    }
    process.exit(1);
});
