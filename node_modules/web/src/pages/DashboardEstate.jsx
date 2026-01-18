import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardEstate = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark text-forest-charcoal dark:text-gray-100 min-h-screen font-display">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary text-white p-2 rounded-lg">
                                    <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_6_535)">
                                            <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_6_535"><rect fill="white" height="48" width="48"></rect></clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-extrabold tracking-tight">HO Plantation</h1>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-80">Estate Management</p>
                                </div>
                            </div>
                            <nav className="hidden md:flex items-center ml-8 gap-1">
                                <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold text-sm">Dashboard</button>
                                <button className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors">Operasional</button>
                                <button onClick={() => navigate('/purchasing-report')} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors">Reports</button>
                                <button onClick={() => navigate('/master-supplier')} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors">Master Data</button>
                                <button onClick={() => navigate('/general-settings')} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors">Settings</button>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
                                <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-pulse"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">5</span>
                                </span>
                            </button>
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-sm font-bold">Budi Santoso</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Estate Manager</span>
                            </div>
                            <div className="relative group">
                                <div className="bg-cover bg-center rounded-full size-10 border-2 border-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB4nagXkKCaHcUSJhPGHM3t_V3CeQ0lU0ZmbE7y-opI2q20eX0YOcyFvstcjggcAypmzNtHsoxygmq6U-CkchExJWtdAU44ALixv3Rzj04nMmPFha2b_VeB7LIWqKw9XHgQoGgGxgu0TRNjCw2lwDnsmmmyQFoeFRpoQa4s_21M0aBOjVEw0I5GD70MFjMRuZhg9Ksh7hIOhXBEkWp7Km6cuDNafc85AuhP0G32q1Ga1bhL75k9Mmjsf7lzKXi0SPTJ13EPpRcHd2Q")' }}></div>
                                <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <button className="flex items-center justify-center p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Logout">
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="mb-10">
                                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Estate Dashboard</h2>
                                <p className="text-gray-600 dark:text-gray-400">Fokus Operasional Kebun & Logistik Lapangan</p>
                            </div>
                            <div className="space-y-12">
                                <section>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Bento Cards */}
                                        <div className="bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Pending PRs</span>
                                            <div className="mt-4 flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-primary">14</span>
                                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Menunggu Approval</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 font-medium">8 Kategori Sparepart, 6 Kategori Pupuk</p>
                                        </div>
                                        <div className="bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Items Received (GR)</span>
                                            <div className="mt-4 flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-forest-charcoal dark:text-white">82</span>
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Bulan ini</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 font-medium">Terakhir: 3 jam yang lalu (Oli Mesin)</p>
                                        </div>
                                        <div className="bg-urgent-yellow/30 border border-urgent-yellow rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-symbols-outlined text-amber-800 text-xl">priority_high</span>
                                                    <span className="text-xs font-bold text-amber-900 uppercase">Need Approval</span>
                                                </div>
                                                <p className="text-2xl font-black text-amber-900">5</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="text-[10px] text-amber-800/80 font-bold uppercase tracking-tighter">Signature Awaiting</p>
                                                <span className="material-symbols-outlined text-amber-800 text-lg">chevron_right</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center justify-between mb-6 px-2">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary">inventory_2</span>
                                            <h3 className="text-xl font-bold tracking-tight text-forest-charcoal dark:text-gray-100">Purchasing & Logistics</h3>
                                        </div>
                                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 mx-6"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div
                                            onClick={() => navigate('/create-pr')}
                                            className="group relative overflow-hidden bg-primary rounded-2xl p-8 cursor-pointer shadow-lg shadow-primary/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="absolute top-0 right-0 -mr-8 -mt-8 size-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                                            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                                                <div className="bg-white/20 size-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                                    <span className="material-symbols-outlined text-white text-4xl">add_shopping_cart</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-white text-2xl font-extrabold mb-1">Buat PR Baru</h4>
                                                    <p className="text-white/80 text-sm">Input permintaan barang operasional (Bibit, Pupuk, Sparepart)</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => navigate('/goods-receipt')}
                                            className="bg-white dark:bg-background-dark border-2 border-primary/20 rounded-2xl p-8 cursor-pointer shadow-sm relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="flex flex-col h-full justify-between gap-12">
                                                <div className="flex justify-between items-start">
                                                    <div className="bg-primary/10 text-primary size-16 rounded-2xl flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-4xl">local_shipping</span>
                                                    </div>
                                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-extrabold">
                                                        Good Receipt
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-forest-charcoal dark:text-white text-2xl font-extrabold mb-1">Penerimaan (GR)</h4>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Verifikasi dan catat barang yang sampai di gudang estate</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => navigate('/purchasing-report')}
                                            className="md:col-span-2 bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-8 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                <div className="bg-primary/5 text-primary size-20 rounded-2xl flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-4xl">inventory</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-xl font-extrabold text-forest-charcoal dark:text-white">Daftar PR (Status Tracking)</h4>
                                                        <span className="text-xs font-bold text-primary">Lihat Semua PR</span>
                                                    </div>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Pantau perjalanan Purchase Request dari Pengajuan hingga pengiriman vendor.</p>
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-2 bg-amber-400 rounded-full"></div>
                                                            <span className="text-[11px] font-bold text-gray-500 uppercase">6 Menunggu HO</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-2 bg-blue-400 rounded-full"></div>
                                                            <span className="text-[11px] font-bold text-gray-500 uppercase">4 Sedang Dikirim</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-2 bg-green-400 rounded-full"></div>
                                                            <span className="text-[11px] font-bold text-gray-500 uppercase">12 Selesai</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="material-symbols-outlined text-gray-300 hidden md:block">arrow_forward_ios</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-80 shrink-0">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden ring-2 ring-primary/5">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                                        <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                            Pending Approvals
                                        </h4>
                                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">5 New</span>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        <div className="p-4 cursor-pointer transition-colors bg-urgent-yellow/10 hover:bg-urgent-yellow/20">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-black text-amber-700 uppercase px-1.5 py-0.5 bg-urgent-yellow rounded">URGENT APPROVAL</span>
                                                <span className="text-[10px] text-gray-400 font-medium">15m lalu</span>
                                            </div>
                                            <h5 className="text-sm font-extrabold text-forest-charcoal dark:text-gray-200">PR-EST-00124</h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">Sparepart Traktor MF-455 (Darurat)</p>
                                            <div className="mt-4 flex gap-2">
                                                <button className="flex-1 py-2 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary-light transition-colors">Sign Now</button>
                                                <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-[11px] font-bold rounded-lg hover:bg-gray-50 transition-colors">Details</button>
                                            </div>
                                        </div>
                                        <div className="p-4 cursor-pointer transition-colors hover:bg-primary/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">PR - NORMAL</span>
                                                <span className="text-[10px] text-gray-400 font-medium">1 jam lalu</span>
                                            </div>
                                            <h5 className="text-sm font-bold text-forest-charcoal dark:text-gray-200">PR-EST-00122</h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pupuk NPK Mutiara (Stok Agt)</p>
                                            <div className="mt-4 flex gap-2">
                                                <button className="flex-1 py-2 bg-primary/10 text-primary text-[11px] font-bold rounded-lg hover:bg-primary/20 transition-colors">Sign</button>
                                                <button className="px-3 py-2 border border-gray-100 dark:border-gray-800 text-[11px] font-bold rounded-lg">View</button>
                                            </div>
                                        </div>
                                        <div className="p-4 cursor-pointer transition-colors hover:bg-primary/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">PO - VERIFY</span>
                                                <span className="text-[10px] text-gray-400 font-medium">3 jam lalu</span>
                                            </div>
                                            <h5 className="text-sm font-bold text-forest-charcoal dark:text-gray-200">PO-LOCAL-049</h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vendor Servis Pompa Air</p>
                                            <div className="mt-4 flex gap-2">
                                                <button className="flex-1 py-2 bg-primary/10 text-primary text-[11px] font-bold rounded-lg hover:bg-primary/20 transition-colors">Verify</button>
                                                <button className="px-3 py-2 border border-gray-100 dark:border-gray-800 text-[11px] font-bold rounded-lg">View</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                                        <a className="text-[11px] font-extrabold text-primary flex items-center justify-center gap-1 hover:underline uppercase tracking-wider" href="#">
                                            Lihat Semua Approval (5)
                                            <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                                    <h5 className="text-xs font-bold text-primary uppercase mb-3">Estate News</h5>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="size-8 rounded bg-white dark:bg-gray-800 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold leading-tight">Pengiriman Pupuk Terlambat</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Estimasi tiba: Besok Pagi</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="size-8 rounded bg-white dark:bg-gray-800 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                                                <span className="material-symbols-outlined text-lg">engineering</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold leading-tight">Servis Alat Berat D-2</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Teknisi HO telah disetujui</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>

                <footer className="max-w-7xl mx-auto w-full px-10 py-8 mt-10 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="size-2 bg-primary rounded-full"></div>
                            <span className="text-xs font-medium text-gray-500">Estate Operational View v2.5.1</span>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">© 2024 HO Plantation ERP. Operational Dashboard.</p>
                        <div className="flex gap-6">
                            <a className="text-xs text-gray-400 hover:text-primary transition-colors font-medium" href="#">SOP Pengadaan</a>
                            <a className="text-xs text-gray-400 hover:text-primary transition-colors font-medium" href="#">Hubungi HO</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardEstate;
