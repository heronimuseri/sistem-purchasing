import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePR = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-forest-charcoal dark:text-gray-200 font-display">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#eef0ea] dark:border-[#3f4339] px-6 lg:px-20 py-4">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-primary">
                            <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                            <span className="font-extrabold text-xl tracking-tight hidden md:block">HO Plantation</span>
                        </div>
                        <nav className="hidden md:flex gap-6 text-sm font-semibold opacity-70">
                            <a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Dashboard</a>
                            <a className="text-primary border-b-2 border-primary" href="#">Purchasing</a>
                            <a className="hover:text-primary transition-colors" href="#">Inventory</a>
                            <a className="hover:text-primary transition-colors" href="#">Reports</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
                        </button>
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-8 pb-32">
                {/* Back Button & Heading */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:translate-x-[-4px] transition-transform"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-4xl font-black tracking-tight text-forest-charcoal dark:text-white">Create Purchase Request</h1>
                        <p className="text-[#7b865f] dark:text-gray-400">Fill out the details below to submit a new purchasing requisition for the plantation unit.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Section 1: PR Information */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#2a2d26] border border-[#eef0ea] dark:border-[#3f4339] shadow-sm rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <h2 className="text-xl font-bold">PR Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-forest-charcoal/70 dark:text-gray-400">PR Number</label>
                                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-500 italic flex items-center justify-between">
                                    <span>PR/2023/10/0042</span>
                                    <span className="text-[10px] font-bold uppercase bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Auto</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-forest-charcoal/70 dark:text-gray-400">Department</label>
                                <select className="form-select w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary">
                                    <option>Select Department</option>
                                    <option defaultValue>Estate Management</option>
                                    <option>Mill Operations</option>
                                    <option>Agronomy Research</option>
                                    <option>HR & General Affairs</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-forest-charcoal/70 dark:text-gray-400">Request Date</label>
                                <div className="relative">
                                    <input
                                        className="form-input w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary"
                                        type="date"
                                        defaultValue="2023-10-24"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-forest-charcoal/70 dark:text-gray-400">Priority Level</label>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Normal</button>
                                    <button className="flex-1 py-3 rounded-xl border-2 border-primary bg-primary/10 text-primary text-sm font-bold">High</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Need Description */}
                    <div className="lg:col-span-1 bg-white dark:bg-[#2a2d26] border border-[#eef0ea] dark:border-[#3f4339] shadow-sm rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <span className="material-symbols-outlined text-primary">description</span>
                            <h2 className="text-xl font-bold">Need Description</h2>
                        </div>
                        <div className="flex flex-col gap-2 h-full">
                            <label className="text-sm font-bold text-forest-charcoal/70 dark:text-gray-400">Justification</label>
                            <textarea
                                className="form-textarea w-full h-[165px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:ring-primary focus:border-primary resize-none"
                                placeholder="Jelaskan alasan permintaan ini..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Section 3: Item Details */}
                    <div className="lg:col-span-3 bg-white dark:bg-[#2a2d26] border border-[#eef0ea] dark:border-[#3f4339] shadow-sm rounded-xl p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">list_alt</span>
                                <h2 className="text-xl font-bold">Daftar Barang</h2>
                            </div>
                            <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-6 py-2 rounded-full font-bold text-sm">
                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                Tambah Barang
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-sm font-bold text-forest-charcoal/60 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                        <th className="pb-4 pl-4 w-16">No</th>
                                        <th className="pb-4">Nama Barang</th>
                                        <th className="pb-4">Jumlah</th>
                                        <th className="pb-4">Satuan</th>
                                        <th className="pb-4 pr-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 pl-4 text-sm">1</td>
                                        <td className="py-4 font-semibold">NPK Fertilizer 15-15-15 (50kg Bag)</td>
                                        <td className="py-4">
                                            <input className="w-24 bg-transparent border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-primary focus:border-primary" type="number" defaultValue="150" />
                                        </td>
                                        <td className="py-4 text-sm">Bags</td>
                                        <td className="py-4 pr-4 text-right">
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 pl-4 text-sm">2</td>
                                        <td className="py-4 font-semibold">Glyphosate Herbicide (20L Jerrycan)</td>
                                        <td className="py-4">
                                            <input className="w-24 bg-transparent border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-primary focus:border-primary" type="number" defaultValue="25" />
                                        </td>
                                        <td className="py-4 text-sm">Units</td>
                                        <td className="py-4 pr-4 text-right">
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 pl-4 text-sm">3</td>
                                        <td className="py-4 font-semibold">Pruning Knife Replacement Blades</td>
                                        <td className="py-4">
                                            <input className="w-24 bg-transparent border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-primary focus:border-primary" type="number" defaultValue="100" />
                                        </td>
                                        <td className="py-4 text-sm">Pieces</td>
                                        <td className="py-4 pr-4 text-right">
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Empty State (Hidden by default) */}
                        <div className="hidden flex-col items-center justify-center py-20 text-center opacity-40">
                            <span className="material-symbols-outlined text-[64px] mb-2">shopping_basket</span>
                            <p className="font-bold">Belum ada barang ditambahkan</p>
                            <p className="text-sm">Klik "Tambah Barang" untuk memulai list PR Anda.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Footer CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-[#eef0ea] dark:border-[#3f4339] py-5 px-6 z-50">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Summary</span>
                        <span className="font-extrabold text-lg">3 Items <span className="text-primary font-normal text-sm ml-2">Estate Dept.</span></span>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Save Draft
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-[#556929] transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                            <span className="material-symbols-outlined text-[20px]">send</span>
                            Ajukan Untuk Disetujui
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePR;
