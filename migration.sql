-- Database Migration Dump
-- Generated on 2026-01-16T04:47:22.188Z

SET FOREIGN_KEY_CHECKS=0;

-- Data for table users
INSERT IGNORE INTO users (id, name, company, user, pass, role, wa_number) VALUES (9, 'Heronimus Eri', 'SPA_70', 'admin', '$2b$10$Gf0lUkNfXp6Nf8SK8tCbZuhMgxPwYo7fIA0aRMaHevO67Yrt7QLPS', 'admin', '62812717788');
INSERT IGNORE INTO users (id, name, company, user, pass, role, wa_number) VALUES (10, 'Nelly Napitupulu', 'SPA_70', 'kerani', '$2b$10$GtzUj71jQ4iR2cpxF0VCdeAqUkeqYGbwuNfzNGXnUw8jabUPGOhfe', 'kerani', '6281353905773');
INSERT IGNORE INTO users (id, name, company, user, pass, role, wa_number) VALUES (11, 'Irwan', 'SPA_70', 'ktu', '$2b$10$oyvuAvmzMCj/P9b6yvgWL.hYUyZmxEMt47tGqVeBV2iMUc9yiZrTS', 'ktu', '6282124927540');
INSERT IGNORE INTO users (id, name, company, user, pass, role, wa_number) VALUES (12, 'Binron Pasaribu', 'SPA_70', 'em', '$2b$10$ibD0Qx5B1bQA69SaTk66DuRswzJ6S018BpEq7fE9ctMsg8h1gXgF.', 'manager', '6282143585556');
INSERT IGNORE INTO users (id, name, company, user, pass, role, wa_number) VALUES (13, 'Irwan', 'SPA_70', 'kepala_gudang', '$2b$10$9fktOvlmy8d.cJaJ3jSSTeib2I/lQzzGhcUgwejSCiTduzxPHxoCe', 'kerani', '6281368862026');

-- Data for table vendors
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (1, '1', 'SIAGIAN AGRO MANDIRI', 'Rizky Rinaldi Hasibuan', '6285216080886', 'Dusun Cinta Makmur Aek Batu Kab.Labuhan Batu Selatan', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (2, '2', 'MULTIAPLIKASI ABADI SUKSES', 'Vincent Irfandy', '6282388899333', 'Jl Imam No. 332 RT 004 RW 010 Tangkerang Lanual Bukit Raya Kota Pekanbaru Riau 28992', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (3, '3', 'MITSUBISHI MOTOR', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (4, '4', '88 MOTOR', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (5, '5', 'BINTANG SURYA BANGUNAN', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (6, '6', 'BINTANG MAKMUR ABADI', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (7, '7', 'TOKO STARINDO', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (8, '8', 'NYANMAR DISEL', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (9, '9', 'SAMARINDA DIESEL', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (10, '10', 'BENGKEL SINAR MUDA', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (11, '11', 'BINTANG MAKMUR ABADI 2', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (12, '12', 'BINA CANTIK 3', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (13, '13', 'AA BESI', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (14, '14', 'USAHA TANI', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (15, '15', 'CIPTO PANGLONG', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (16, '16', 'BINTANG BANGUNAN', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (17, '17', 'SINAR TANI MAKMUR', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (18, '18', 'YANMAR DIESEL', '', '', '', '2026-01-16 03:40:19', '2026-01-16 03:40:19');
INSERT IGNORE INTO vendors (id, kode, nama, pic, no_hp, alamat, created_at, updated_at) VALUES (19, '19', 'TANI SAWIT MANDIRI', 'Rizky Rinaldi Hasibuan', '6285216080886', 'Bagan Batu', '2026-01-16 04:13:45', '2026-01-16 04:13:45');

-- Data for table pr_counters
INSERT IGNORE INTO pr_counters (year, last_seq) VALUES (2025, 2);
INSERT IGNORE INTO pr_counters (year, last_seq) VALUES (2026, 4);

-- Data for table purchase_requests
INSERT IGNORE INTO purchase_requests (id, pr_no, tanggal, keperluan, departemen, status, requester_id, requester_name, ktu_name, manager_name, approval_ktu_date, approval_manager_date, created_at) VALUES (35, '002/PR-SPA/Estate/X/2025', '2025-09-30 17:00:00', 'Natura Beras Karyawan Non Staff Periode September 2025', 'Estate', 'Fully Approved', 13, 'Irwan', 'Josua M Siregar', 'Binron Pasaribu', '2025-10-01 09:03:21', '2025-10-01 09:03:56', '2025-10-01 09:03:02');
INSERT IGNORE INTO purchase_requests (id, pr_no, tanggal, keperluan, departemen, status, requester_id, requester_name, ktu_name, manager_name, approval_ktu_date, approval_manager_date, created_at) VALUES (46, '001/PR-SPA/Estate/I/2026', '2026-01-13 17:00:00', 'Kebutuhan Perabotan Dapur Asisten Divisi', 'Estate', 'Rejected', 10, 'Nelly Napitupulu', 'Irwan', NULL, '2026-01-14 16:07:51', NULL, '2026-01-14 16:07:27');
INSERT IGNORE INTO purchase_requests (id, pr_no, tanggal, keperluan, departemen, status, requester_id, requester_name, ktu_name, manager_name, approval_ktu_date, approval_manager_date, created_at) VALUES (47, '002/PR-SPA/Estate/I/2026', '2026-01-13 17:00:00', 'Spare part SN01', 'Estate', 'Fully Approved', 10, 'Nelly Napitupulu', 'Irwan', 'Binron Pasaribu', '2026-01-14 16:09:25', '2026-01-14 16:09:35', '2026-01-14 16:09:08');
INSERT IGNORE INTO purchase_requests (id, pr_no, tanggal, keperluan, departemen, status, requester_id, requester_name, ktu_name, manager_name, approval_ktu_date, approval_manager_date, created_at) VALUES (48, '003/PR-SPA/Pabrik/I/2026', '2026-01-15 17:00:00', 'Perlengkapan Kantor ATK HO periode Januari 2026 ', 'Pabrik', 'Fully Approved', 10, 'Nelly Napitupulu', 'Irwan', 'Binron Pasaribu', '2026-01-16 02:52:51', '2026-01-16 02:53:10', '2026-01-16 02:47:06');
INSERT IGNORE INTO purchase_requests (id, pr_no, tanggal, keperluan, departemen, status, requester_id, requester_name, ktu_name, manager_name, approval_ktu_date, approval_manager_date, created_at) VALUES (49, '004/PR-SPA/Estate/I/2026', '2026-01-15 17:00:00', 'Perbaikan  Mobil SNA 02', 'Estate', 'Fully Approved', 10, 'Nelly Napitupulu', 'Irwan', 'Binron Pasaribu', '2026-01-16 02:52:48', '2026-01-16 02:53:07', '2026-01-16 02:52:30');

-- Data for table pr_items
INSERT IGNORE INTO pr_items (id, pr_id, material, qty, satuan) VALUES (44, 35, 'Beras', 130, 'Sak');
INSERT IGNORE INTO pr_items (id, pr_id, material, qty, satuan) VALUES (61, 46, 'Spray Ukuran 180', 5, 'Buah');
INSERT IGNORE INTO pr_items (id, pr_id, material, qty, satuan) VALUES (62, 47, 'Ban', 2, 'Buah');
INSERT IGNORE INTO pr_items (id, pr_id, material, qty, satuan) VALUES (63, 48, 'Pulpen', 1, 'Box');
INSERT IGNORE INTO pr_items (id, pr_id, material, qty, satuan) VALUES (64, 48, 'Kertas A4', 1, 'Box');
INSERT IGNORE INTO pr_items (id, pr_id, material, qty, satuan) VALUES (65, 49, 'Ban', 2, 'Buah');

SET FOREIGN_KEY_CHECKS=1;
