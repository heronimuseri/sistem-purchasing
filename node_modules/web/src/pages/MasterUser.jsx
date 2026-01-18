import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MasterUser = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Roles & Permissions');

    const toggleClasses = "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none transition-all duration-300";
    const labelClasses = "toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-all duration-300";

    return (
        <div className="bg-background-light dark:bg-background-dark text-forest dark:text-gray-200 antialiased overflow-x-hidden h-screen flex">
            {/* Sidebar - Copied/Adapted from provided HTML structure */}
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
                        <button onClick={() => navigate('/master-supplier')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
                            <span className="material-symbols-outlined">database</span>
                            <span className="text-sm font-semibold">Master Data</span>
                        </button>
                        <button onClick={() => navigate('/general-settings')} className="flex items-center gap-3 px-4 py-3 rounded-xl active-nav shadow-lg shadow-primary/20 w-full text-left">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-semibold">Settings</span>
                        </button>
                    </nav>
                </div>
                <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-iKc9mBBOjv8fm5_NYmmgabmANXh-9AQUBrHSRomDdzEyeRJLgO0noE16r5I0-_g3L41H_UuO5lozFV0inHfXCOh_tWx8KINUkL7AwsMgBacClLWFa0QCOJeJCemkbf34uu24kKoyG-a2ILrlhSu2z8Niw2dx0URPdcZ_0CareYFwAfl5OE-zo3zWrLlW9SxPZSqhFy51soI4M2cHEGvrwURy-inTas0jmyR_V06Wx_0uYxv-e0p7Z78EEZgbGXF3eHPcNcCk-uA')" }}></div>
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
                        <span className="text-forest dark:text-gray-200">System Settings</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <div>
                            <h2 className="text-4xl font-black text-forest dark:text-white tracking-tight">System Settings</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global configurations and role-based access control.</p>
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-xl">save</span>
                            <span>Save Changes</span>
                        </button>
                    </div>
                </header>
                <section className="px-10 mb-6">
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => navigate('/general-settings')}
                            className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-forest dark:hover:text-white transition-all"
                        >
                            General Settings
                        </button>
                        <button
                            className="px-8 py-4 text-sm font-bold border-b-2 border-primary text-primary transition-all"
                        >
                            Roles & Permissions
                        </button>
                    </div>
                </section>
                <section className="px-10 pb-10">
                    <div className="bg-white dark:bg-[#1a1c18] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-forest dark:text-white">Role Access Control</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Define module access per job role</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="material-symbols-outlined text-sm text-primary">info</span>
                                Changes are auto-drafted until saved
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1a1c18] border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Role Designation</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Dashboard Access</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Permission Scope</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {[
                                        {
                                            role: 'Kerani',
                                            dashboards: ['Estate'],
                                            permissions: [
                                                'Membuat PR & BPB',
                                                'Monitoring Status PR',
                                                'Monitoring Inventory/Gudang'
                                            ]
                                        },
                                        {
                                            role: 'Asisten Traksi',
                                            dashboards: ['Estate'],
                                            permissions: [
                                                'Approval Level 1 (Khusus SPAREPART)'
                                            ]
                                        },
                                        {
                                            role: 'KTU',
                                            dashboards: ['Estate'],
                                            permissions: [
                                                'Approval Level 1 (Pupuk, Herbisida, BBM, Umum)'
                                            ]
                                        },
                                        {
                                            role: 'Manager Estate',
                                            dashboards: ['Estate'],
                                            permissions: [
                                                'Approval Level 2 (Semua Kategori PR)'
                                            ]
                                        },
                                        {
                                            role: 'Purchasing HO',
                                            dashboards: ['Estate', 'HO'],
                                            permissions: [
                                                'Membuat PO (PR Fully Approved)'
                                            ]
                                        },
                                        {
                                            role: 'Manager HO',
                                            dashboards: ['Estate', 'HO'],
                                            permissions: [
                                                'Approval Level 1 (Setiap PO)'
                                            ]
                                        },
                                        {
                                            role: 'Direktur',
                                            dashboards: ['HO'],
                                            permissions: [
                                                'Approval Level 2 (Setiap PO)'
                                            ]
                                        }
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-[#232620] transition-colors group">
                                            <td className="px-6 py-4 align-top">
                                                <span className="text-sm font-bold text-forest dark:text-white group-hover:text-primary transition-colors block mb-1">{row.role}</span>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex gap-2">
                                                    {row.dashboards.map(d => (
                                                        <span key={d} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${d === 'Estate'
                                                            ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                            : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                                            }`}>
                                                            {d} Dashboard
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <ul className="space-y-1">
                                                    {row.permissions.map((perm, i) => (
                                                        <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                            <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">check_circle</span>
                                                            {perm}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 text-right align-top">
                                                <button className="text-gray-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <span className="material-symbols-outlined text-xl">edit_note</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-gray-50/30 dark:bg-[#151713] border-t border-gray-100 dark:border-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Security Policy</h4>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-3 bg-white dark:bg-[#232620] rounded-xl border border-gray-100 dark:border-gray-800">
                                            <span className="text-sm font-bold">Require 2FA for Admin roles</span>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input defaultChecked className={toggleClasses} type="checkbox" />
                                                <label className={labelClasses}></label>
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between p-3 bg-white dark:bg-[#232620] rounded-xl border border-gray-100 dark:border-gray-800">
                                            <span className="text-sm font-bold">Auto-logout after 30m inactivity</span>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input defaultChecked className={toggleClasses} type="checkbox" />
                                                <label className={labelClasses}></label>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Audit Logs</h4>
                                    <div className="bg-white dark:bg-[#232620] p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400">Last permission change:</span>
                                            <span className="font-bold">24 Oct 2023, 14:20</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400">Changed by:</span>
                                            <span className="font-bold text-primary">Admin Utama</span>
                                        </div>
                                        <button className="w-full py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-xs font-bold rounded-lg transition-colors mt-2">View History Logs</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div >
    );
};

export default MasterUser;
