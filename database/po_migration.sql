-- PO System Database Migration
-- Generated on 2026-01-16

SET FOREIGN_KEY_CHECKS=0;

-- ===========================================
-- Table: po_counters (Auto-increment PO number)
-- ===========================================
CREATE TABLE IF NOT EXISTS po_counters (
    year INT PRIMARY KEY,
    last_seq INT DEFAULT 0
);

-- ===========================================
-- Table: purchase_orders
-- ===========================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_no VARCHAR(50) NOT NULL UNIQUE,
    pr_id INT NOT NULL,
    tanggal DATE NOT NULL,
    vendor_id INT NOT NULL,
    keperluan TEXT,
    departemen VARCHAR(100),
    status ENUM('Pending Manager HO Approval', 'Pending Direktur Approval', 'Fully Approved', 'Dikirim', 'Diterima', 'Rejected') DEFAULT 'Pending Manager HO Approval',
    include_ppn BOOLEAN DEFAULT FALSE,
    purchaser_id INT NOT NULL,
    purchaser_name VARCHAR(100),
    manager_ho_name VARCHAR(100) DEFAULT NULL,
    approval_manager_ho_date DATETIME DEFAULT NULL,
    direktur_name VARCHAR(100) DEFAULT NULL,
    approval_direktur_date DATETIME DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    -- Delivery tracking
    tanggal_kirim DATE DEFAULT NULL,
    tanggal_terima DATE DEFAULT NULL,
    penerima_name VARCHAR(100) DEFAULT NULL,
    -- Totals
    total_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pr_id) REFERENCES purchase_requests(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- ===========================================
-- Table: po_items
-- ===========================================
CREATE TABLE IF NOT EXISTS po_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    material VARCHAR(255) NOT NULL,
    qty DECIMAL(10, 2) NOT NULL,
    satuan VARCHAR(50) NOT NULL,
    harga_satuan DECIMAL(15, 2) DEFAULT 0,
    total_harga DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

-- ===========================================
-- Table: invoices (Permintaan Dana Supplier)
-- ===========================================
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    periode VARCHAR(50) NOT NULL,
    vendor_id INT NOT NULL,
    nama_rekening VARCHAR(100),
    no_rekening VARCHAR(50),
    nama_bank VARCHAR(100),
    keterangan_pembayaran TEXT,
    tanggal DATE NOT NULL,
    jatuh_tempo DATE NOT NULL,
    status ENUM('Pending Manager HO', 'Pending Direktur', 'Approved', 'Rejected') DEFAULT 'Pending Manager HO',
    subtotal DECIMAL(15, 2) DEFAULT 0,
    ppn DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) DEFAULT 0,
    purchaser_id INT NOT NULL,
    purchaser_name VARCHAR(100),
    manager_ho_name VARCHAR(100) DEFAULT NULL,
    approval_manager_ho_date DATETIME DEFAULT NULL,
    direktur_name VARCHAR(100) DEFAULT NULL,
    approval_direktur_date DATETIME DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- ===========================================
-- Table: invoice_po (Many-to-Many: Invoice <-> PO)
-- ===========================================
CREATE TABLE IF NOT EXISTS invoice_po (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    po_id INT NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id)
);

-- ===========================================
-- Table: invoice_counters
-- ===========================================
CREATE TABLE IF NOT EXISTS invoice_counters (
    year INT PRIMARY KEY,
    last_seq INT DEFAULT 0
);

SET FOREIGN_KEY_CHECKS=1;
