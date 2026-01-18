import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoodsReceipt = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark text-forest dark:text-gray-100 min-h-screen flex font-display">
            {/* Sidebar Navigation */}
            <aside className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-background-dark sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined filled-icon">potted_plant</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-tight">HO Plantation</h1>
                        <p className="text-xs text-primary font-medium uppercase tracking-wider">Purchasing System</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-semibold">Dashboard</span>
                    </button>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span className="text-sm font-semibold">Purchasing</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined filled-icon">warehouse</span>
                        <span className="text-sm font-bold">Gudang</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-sm font-semibold">Inventory</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm font-semibold">Finance</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="text-sm font-semibold">Reports</span>
                    </a>
                </nav>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                {/* Header Section */}
                <header className="h-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <a className="hover:text-primary transition-colors" href="#">Gudang</a>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-forest dark:text-white">Penerimaan Barang</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </button>
                            <button onClick={() => navigate('/general-settings')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-200 dark:border-gray-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-forest dark:text-white">Aditya Wijaya</p>
                                <p className="text-xs text-gray-500">Warehouse Manager</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary/20 bg-cover bg-center border-2 border-primary/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD022AKV_DS4Spct28RRcxf1GrjjucZ6XzOtoCs4C1gc71Z84IS3jJk4SsksQWAz-erWXRs7zue3ZtHTJkPjy1BSkmYRO6XxsVVf0Rt73hE9dcFhyv3j5K3eaW3MOe93EtRow1OJHOGy1JRmjaqThM0RBAjlpfvv9MzD83cHfd-8Q_bKV2Y0fcPwe-t8iJU6XgkKZ1KlfCW0iTmDGbVP975Y8glmZw-XH3l4KxfKw4TLEmjMwPU3O1G3u6VmXAmo5YKjYu9E-mbbCs')" }}></div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
                    {/* Welcome/Heading */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-forest dark:text-white tracking-tight">Penerimaan Barang</h2>
                            <p className="text-gray-500 font-medium">List of Purchase Orders ready for incoming goods receipt.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">file_download</span> Export
                            </button>
                            <button className="px-4 py-2 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span> Filters
                            </button>
                        </div>
                    </div>

                    {/* Bento Search Container */}
                    <div className="bg-white dark:bg-background-dark p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 p-2">
                            <div className="flex-1 relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl pl-12 pr-4 py-4 text-base focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 text-forest dark:text-white" placeholder="Search by No PO or Vendor name..." type="text" />
                            </div>
                            <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:primary/90 transition-all active:scale-95">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white dark:bg-background-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50">
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800">No. Purchase Order</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800">Vendor Detail</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800">Issue Date</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800">Logistics Status</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {/* Row 1 */}
                                <tr className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-extrabold text-forest dark:text-white">PO-2023-08-001</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-forest dark:text-white">PT. Pupuk Sriwidjaja</span>
                                            <span className="text-xs text-gray-400">Palembang, Indonesia</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">12 Oct 2023</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span> Sent
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate('/input-bpb')}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                title="Entry"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => navigate('/print-bpb')}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                title="Print"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">print</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-extrabold text-forest dark:text-white">PO-2023-08-105</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-forest dark:text-white">CV. Traktor Nusantara</span>
                                            <span className="text-xs text-gray-400">Jakarta Pusat</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">14 Oct 2023</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span> Sent
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate('/input-bpb')}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                title="Entry"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all" title="Print">
                                                <span className="material-symbols-outlined text-[20px]">print</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-extrabold text-forest dark:text-white">PO-2023-09-022</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-forest dark:text-white">PT. Astra Agro Lestari</span>
                                            <span className="text-xs text-gray-400">Riau Branch</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">18 Oct 2023</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span> In Transit
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate('/input-bpb')}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                title="Entry"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all" title="Print">
                                                <span className="material-symbols-outlined text-[20px]">print</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 4 */}
                                <tr className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-extrabold text-forest dark:text-white">PO-2023-09-045</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-forest dark:text-white">Global Agri Parts Co.</span>
                                            <span className="text-xs text-gray-400">Surabaya</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">20 Oct 2023</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span> Sent
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate('/input-bpb')}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                title="Entry"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button className="h-9 w-9 flex items-center justify-center rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all" title="Print">
                                                <span className="material-symbols-outlined text-[20px]">print</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 font-medium">Showing 1 to 4 of 24 results</p>
                            <div className="flex gap-2">
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-forest dark:hover:text-white hover:bg-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-white">2</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-white">3</button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-forest dark:hover:text-white hover:bg-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bento Mini Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/10">
                            <p className="text-sm font-bold opacity-80 mb-2">Pending Receipts</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black">24</h3>
                                <span className="material-symbols-outlined text-4xl opacity-50">pending_actions</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-bold text-gray-500 mb-2">Total POs this Month</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black text-forest dark:text-white">142</h3>
                                <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-700">receipt_long</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-bold text-gray-500 mb-2">Avg. Processing Time</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black text-forest dark:text-white">1.2d</h3>
                                <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-700">schedule</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GoodsReceipt;
