-- ============================================================
-- Script SQL untuk Railway MySQL - Sistem Purchasing
-- Jalankan script ini di Railway MySQL Console
-- ============================================================

-- Buat database jika belum ada (Railway biasanya sudah menyediakan database)
-- CREATE DATABASE IF NOT EXISTS railway;
-- USE railway;

-- ============================================================
-- 1. Tabel Users (untuk autentikasi dan manajemen pengguna)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(100) DEFAULT NULL,
    `user` VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    role ENUM('admin', 'kerani', 'ktu', 'manager', 'purchasing', 'manager_ho', 'direktur') NOT NULL DEFAULT 'kerani',
    name VARCHAR(100) NOT NULL,
    wa_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Tabel Purchase Requests (tabel utama untuk PR)
-- ============================================================
CREATE TABLE IF NOT EXISTS purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pr_no VARCHAR(50) UNIQUE,
    tanggal DATE NOT NULL,
    keperluan TEXT NOT NULL,
    departemen VARCHAR(50) NOT NULL,
    status ENUM('Pending KTU Approval', 'Pending Manager Approval', 'Fully Approved', 'Rejected') DEFAULT 'Pending KTU Approval',
    requester_id INT,
    requester_name VARCHAR(100) NOT NULL,
    ktu_name VARCHAR(100) DEFAULT NULL,
    approval_ktu_date DATETIME DEFAULT NULL,
    manager_name VARCHAR(100) DEFAULT NULL,
    approval_manager_date DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Tabel PR Items (item-item dalam setiap PR)
-- ============================================================
CREATE TABLE IF NOT EXISTS pr_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pr_id INT NOT NULL,
    material VARCHAR(255) NOT NULL,
    qty DECIMAL(10, 2) NOT NULL,
    satuan VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pr_id) REFERENCES purchase_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Tabel PR Counters (untuk generate nomor PR otomatis)
-- ============================================================
CREATE TABLE IF NOT EXISTS pr_counters (
    year INT PRIMARY KEY,
    last_seq INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4.1. Tabel Vendors
-- ============================================================
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode VARCHAR(50) UNIQUE,
    nama VARCHAR(100) NOT NULL,
    pic VARCHAR(100) DEFAULT NULL,
    no_hp VARCHAR(20) DEFAULT NULL,
    alamat TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4.2. Tabel PO Counters
-- ============================================================
CREATE TABLE IF NOT EXISTS po_counters (
    year INT PRIMARY KEY,
    last_seq INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4.3. Tabel Purchase Orders
-- ============================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4.4. Tabel PO Items
-- ============================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4.5. Tabel Invoices
-- ============================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4.6. Tabel Invoice PO & Counters
-- ============================================================
CREATE TABLE IF NOT EXISTS invoice_po (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    po_id INT NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS invoice_counters (
    year INT PRIMARY KEY,
    last_seq INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Insert User Admin Default (PENTING: Ganti password!)
-- Password default: admin123 (sudah di-hash dengan bcrypt)
-- ============================================================
INSERT IGNORE INTO users (company, `user`, pass, role, name, wa_number) VALUES 
('PT SPA', 'admin', '$2b$10$rKN3r9O5QZv0d7Xz8V2pZuQxj3KzW5r6yVvGpM1wH8nL4jC0eF2Ki', 'admin', 'Administrator', '081234567890')
ON DUPLICATE KEY UPDATE name = name;

-- ============================================================
-- Catatan Penting untuk Railway:
-- ============================================================
-- 1. Setelah membuat MySQL service di Railway, copy MYSQL_URL
-- 2. Set environment variable MYSQL_URL di aplikasi Railway
-- 3. Jalankan script ini via Railway MySQL Console atau DBeaver
-- 4. Password admin default: admin123 (SEGERA GANTI!)
-- ============================================================
