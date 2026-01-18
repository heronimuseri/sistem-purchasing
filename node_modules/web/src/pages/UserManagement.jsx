import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
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
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl active-nav shadow-lg shadow-primary/20 w-full text-left">
                            <span className="material-symbols-outlined">group</span>
                            <span className="text-sm font-semibold">User Management</span>
                        </button>
                        <button onClick={() => navigate('/master-supplier')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
                            <span className="material-symbols-outlined">database</span>
                            <span className="text-sm font-semibold">Master Data</span>
                        </button>
                        <button onClick={() => navigate('/master-user')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
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
                        <span className="text-forest dark:text-gray-200">User Management</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <h2 className="text-4xl font-black text-forest dark:text-white tracking-tight">Master User</h2>
                        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
                            <span className="material-symbols-outlined">person_add</span>
                            <span>+ Tambah User</span>
                        </button>
                    </div>
                </header>
                <section className="px-10 pb-10">
                    <div className="bg-white dark:bg-[#1a1c18] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1c18]">
                            <div className="relative max-w-md">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input className="w-full bg-white dark:bg-[#232620] border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary rounded-xl pl-12 pr-4 py-3 text-sm transition-all" placeholder="Search users by name, company, or role..." type="text" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1a1c18] border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">User ID</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Company/Entity</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">UserID</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {[
                                        { id: '101', initial: 'AH', name: 'Ahmad Hidayat', entity: 'Plantation A (Sumatra)', username: 'ahmad_h', role: 'Admin', roleClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800', initialClass: 'bg-primary/10 text-primary' },
                                        { id: '102', initial: 'SA', name: 'Siti Aminah', entity: 'Plantation B (Kalimantan)', username: 'siti_a', role: 'Manager', roleClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', initialClass: 'bg-plantation-gold/10 text-plantation-gold' },
                                        { id: '103', initial: 'BS', name: 'Budi Santoso', entity: 'HO Jakarta', username: 'budi_s', role: 'Super Admin', roleClass: 'bg-primary text-white border-primary/20', initialClass: 'bg-purple-100 text-purple-700' },
                                        { id: '104', initial: 'DL', name: 'Dewi Lestari', entity: 'Plantation A (Sumatra)', username: 'dewi_l', role: 'Staff', roleClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700', initialClass: 'bg-gray-100 text-gray-600' }
                                    ].map((user, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-[#232620] transition-colors">
                                            <td className="px-6 py-5 text-sm font-medium text-gray-500">{user.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-8 rounded-lg ${user.initialClass} flex items-center justify-center font-bold text-xs`}>{user.initial}</div>
                                                    <span className="text-sm font-bold text-forest dark:text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-500">{user.entity}</td>
                                            <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">{user.username}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.roleClass}`}>{user.role}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal Overlay */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center modal-overlay ${isModalOpen ? '' : 'hidden'}`}>
                {/* Modal Card */}
                <div className="bg-white dark:bg-[#1a1c18] w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
                    {/* Modal Header */}
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-[#151713]">
                        <div>
                            <h3 className="text-xl font-extrabold text-forest dark:text-white tracking-tight">Tambah User Baru</h3>
                            <p className="text-sm text-gray-400 font-medium">Lengkapi informasi personil untuk akses sistem.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>
                    {/* Modal Content */}
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="e.g. Ahmad Hidayat" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Username / UserID</label>
                                <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="e.g. ahmad_h" type="text" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Company / Entity</label>
                            <select className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full appearance-none">
                                <option>Head Office Jakarta</option>
                                <option>Plantation A (Sumatra)</option>
                                <option>Plantation B (Kalimantan)</option>
                                <option>Plantation C (Sulawesi)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Access Role</label>
                                <select className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full appearance-none">
                                    <option>Staff</option>
                                    <option>Manager</option>
                                    <option>Admin</option>
                                    <option>Super Admin</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Password</label>
                                <div className="relative">
                                    <input className="bg-gray-50 dark:bg-[#232620] border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-primary w-full" placeholder="••••••••" type="password" />
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-sm">visibility</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Modal Footer */}
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#151713] border-t border-gray-100 dark:border-gray-800 flex justify-end items-center gap-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            Batal
                        </button>
                        <button className="px-8 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                            Simpan User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
