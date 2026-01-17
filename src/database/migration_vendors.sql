-- Database Migration: Create vendors table
-- Run this in MySQL

USE sistem_purchasing;

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(10) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  pic VARCHAR(255),
  no_hp VARCHAR(50),
  alamat TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial vendor data
INSERT INTO vendors (kode, nama, pic, no_hp, alamat) VALUES
('1', 'SIAGIAN AGRO MANDIRI', 'Rizky Rinaldi Hasibuan', '6285216080886', 'Dusun Cinta Makmur Aek Batu Kab.Labuhan Batu Selatan'),
('2', 'MULTIAPLIKASI ABADI SUKSES', 'Vincent Irfandy', '6282388899333', 'Jl Imam No. 332 RT 004 RW 010 Tangkerang Lanual Bukit Raya Kota Pekanbaru Riau 28992'),
('3', 'MITSUBISHI MOTOR', '', '', ''),
('4', '88 MOTOR', '', '', ''),
('5', 'BINTANG SURYA BANGUNAN', '', '', ''),
('6', 'BINTANG MAKMUR ABADI', '', '', ''),
('7', 'TOKO STARINDO', '', '', ''),
('8', 'NYANMAR DISEL', '', '', ''),
('9', 'SAMARINDA DIESEL', '', '', ''),
('10', 'BENGKEL SINAR MUDA', '', '', ''),
('11', 'BINTANG MAKMUR ABADI', '', '', ''),
('12', 'BINA CANTIK 3', '', '', ''),
('13', 'AA BESI', '', '', ''),
('14', 'USAHA TANI', '', '', ''),
('15', 'CIPTO PANGLONG', '', '', ''),
('16', 'BINTANG BANGUNAN', '', '', ''),
('17', 'SINAR TANI MAKMUR', '', '', ''),
('18', 'YANMAR DIESEL', '', '', '')
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

SELECT * FROM vendors;
