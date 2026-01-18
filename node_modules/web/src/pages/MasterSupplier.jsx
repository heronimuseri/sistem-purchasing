import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MasterSupplier = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-forest dark:text-gray-200 antialiased overflow-x-hidden h-screen flex">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151713] flex flex-col justify-between py-8 px-6">
                <div className="flex flex-col gap-10">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-3xl">potted_plant</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-forest dark:text-white text-lg font-extrabold leading-none tracking-tight uppercase">HO Plantation</h1>
                            <p className="text-primary text-xs font-semibold tracking-widest uppercase mt-1">ERP System</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-semibold">Dashboard</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span className="text-sm font-semibold">Purchasing</span>
                        </button>
                        <button onClick={() => navigate('/user-management')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
                            <span className="material-symbols-outlined">group</span>
                            <span className="text-sm font-semibold">User Management</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl active-nav shadow-lg shadow-primary/20 w-full text-left">
                            <span className="material-symbols-outlined">database</span>
                            <span className="text-sm font-semibold">Master Data</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-semibold">Settings</span>
                        </button>
                    </nav>
                </div>
                <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLxCBjjspNd6Z0FGPmewuH6impjGZkBSw-zdzB_ybq704Minem5a2caKdbZaprLNYnFL3vbdQiF48CC-96xy4Mz_g67Z4gbGgnSidv8WfXxvZSnH1l7ACzoVRHCU3gn1S_QTkl84LCgsWfusGih0nzEnRMhKu1Da_JQGD-1ny9cOpannN0I2mfwv3kWtZRSGZcPbYImlMw6cNc9l5V4Og1TBHfXXerCZoMOKByzjfKPRZRLJM48JNCfRwk6kSWCCBdVQcX6auZ7qg')" }}></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-forest dark:text-white">Admin Utama</span>
                            <span className="text-xs text-gray-400">Head Office</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="px-10 py-6">
                    <div className="flex flex-wrap gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
                        <a className="hover:text-primary transition-colors" href="#">Admin</a>
                        <span>/</span>
                        <a className="hover:text-primary transition-colors" href="#">Master Data</a>
                        <span>/</span>
                        <span className="text-forest dark:text-gray-200">Master Supplier</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <h2 className="text-4xl font-black text-forest dark:text-white tracking-tight">Master Supplier</h2>
                        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
                            <span className="material-symbols-outlined">add_business</span>
                            <span>+ Tambah Supplier</span>
                        </button>
                    </div>
                </header>
                <section className="px-10 pb-10">
                    <div className="bg-white dark:bg-[#1a1c18] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1c18]">
                            <div className="relative max-w-md">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input className="w-full bg-white dark:bg-[#232620] border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary rounded-xl pl-12 pr-4 py-3 text-sm transition-all" placeholder="Search suppliers by name, address, or contact..." type="text" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1a1c18] border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Supplier Name</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Contact Person</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Phone</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Address</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {[
                                        { initial: 'SP', name: 'Sinar Perkasa Ltd.', type: 'Fertilizer Division', address: 'Jl. Industri Raya No. 45, Kawasan MM2100, Bekasi', contact: 'Hendro Wicaksono', phone: '+62 21 890 1234', email: 'hendro@sinarperkasa.co.id', color: 'bg-primary/10 text-primary' },
                                        { initial: 'TB', name: 'Tani Bakti Mandiri', type: 'Seed Supplier', address: 'Komp. Pertanian Blok C, Medan, Sumatra Utara', contact: 'Linda Wijaya', phone: '+62 61 455 7890', email: 'sales@tanibakti.com', color: 'bg-plantation-gold/10 text-plantation-gold' },
                                        { initial: 'GM', name: 'Global Machinery', type: 'Heavy Equipment', address: 'Jl. Jendral Sudirman No. 102, Jakarta Pusat', contact: 'Bambang S.', phone: '+62 21 570 9999', email: 'bambang@globalmachinery.com', color: 'bg-blue-100 text-blue-700' },
                                        { initial: 'AP', name: 'Agro Persada', type: 'Pesticides', address: 'Kawasan Industri Kariangau, Balikpapan', contact: 'Siti Rahma', phone: '+62 542 760 121', email: 'siti@agropersada.id', color: 'bg-purple-100 text-purple-700' }
                                    ].map((supplier, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-[#232620] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-10 rounded-lg ${supplier.color} flex items-center justify-center font-bold text-sm`}>{supplier.initial}</div>
                                                    <div>
                                                        <span className="text-sm font-bold text-forest dark:text-white block">{supplier.name}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{supplier.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">{supplier.contact}</td>
                                            <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">{supplier.phone}</td>
                                            <td className="px-6 py-5 text-sm text-gray-500">{supplier.email}</td>
                                            <td className="px-6 py-5 text-sm text-gray-500 max-w-xs truncate">{supplier.address}</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-gray-50/30 dark:bg-[#151713] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 1 to 4 of 28 Suppliers</span>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                <button className="size-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">1</button>
                                <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-white transition-colors text-xs font-bold">2</button>
                                <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white transition-colors"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center modal-overlay ${isModalOpen ? '' : 'hidden'}`}>
                <div className="bg-white dark:bg-[#1a1c18] w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-[#151713]">
                        <div>
                            <h3 className="text-xl font-extrabold text-forest dark:text-white tracking-tight">Tambah Supplier Baru</h3>
                            <p className="text-sm text-gray-400 font-medium">Daftarkan mitra supplier baru ke dalam database.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Supplier Name</label>
                            <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="e.g. PT Pupuk Indonesia" type="text" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Address</label>
                            <textarea className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full h-24 resize-none" placeholder="Lengkapi alamat lengkap supplier..."></textarea>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Contact Person</label>
                            <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="Nama penanggung jawab" type="text" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Phone Number</label>
                                <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="+62..." type="tel" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
                                <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="email@supplier.com" type="email" />
                            </div>
                        </div>
                    </div>
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#151713] border-t border-gray-100 dark:border-gray-800 flex justify-end items-center gap-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            Batal
                        </button>
                        <button className="px-8 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                            Simpan Supplier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterSupplier;
