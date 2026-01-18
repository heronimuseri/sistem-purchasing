import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PurchasingReport = () => {
    const navigate = useNavigate();
    const [activeSidebarItem, setActiveSidebarItem] = useState('Purchasing Reports');

    return (
        <div className="bg-background-light dark:bg-background-dark text-forest-charcoal dark:text-gray-100 min-h-screen flex font-display">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-primary/10 bg-white dark:bg-gray-900 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">potted_plant</span>
                    </div>
                    <h1 className="font-bold text-lg tracking-tight">HO Plantation</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <a
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 sidebar-item-active text-primary rounded-l-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="font-medium">Purchasing Reports</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="font-medium">Stock Control</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">agriculture</span>
                        <span className="font-medium">Estate Operations</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-medium">Settings</span>
                    </a>
                </nav>
                <div className="p-6 border-t border-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            JD
                        </div>
                        <div>
                            <p className="text-sm font-bold">John Doe</p>
                            <p className="text-xs text-gray-500">Procurement Manager</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Navigation Bar */}
                <header className="h-16 border-b border-primary/10 bg-white dark:bg-gray-900 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-forest-charcoal text-sm font-bold transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span>Back</span>
                        </button>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <nav className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Main</span>
                            <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
                            <span className="font-semibold">Purchasing Reports</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary/90 transition-all">
                            <span className="material-symbols-outlined text-base">file_download</span>
                            <span>Export Excel</span>
                        </button>
                        <button className="p-2 rounded-xl bg-gray-100 text-forest-charcoal hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>
                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* Screen Header */}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-extrabold tracking-tight">Purchasing Analysis</h2>
                        <p className="text-gray-500">Real-time procurement oversight for all plantation estates.</p>
                    </div>

                    {/* Bento Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total PR */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-primary/10 custom-shadow flex flex-col justify-between group transition-all hover:border-primary/40">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+12.4%</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total PR</p>
                                <p className="text-3xl font-extrabold mt-1">1,284</p>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-primary/10 custom-shadow flex flex-col justify-between group transition-all hover:border-accent-yellow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-accent-yellow/10 text-accent-yellow group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">pending_actions</span>
                                </div>
                                <span className="text-accent-yellow text-xs font-bold bg-accent-yellow/5 px-2 py-1 rounded-md border border-accent-yellow/20">+5.2%</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                                <p class="text-3xl font-extrabold mt-1">156</p>
                            </div>
                        </div>

                        {/* Approved */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-primary/10 custom-shadow flex flex-col justify-between group transition-all hover:border-primary">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <span className="text-primary text-xs font-bold bg-primary/5 px-2 py-1 rounded-md border border-primary/20">81.2% Total</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Approved PRs</p>
                                <p className="text-3xl font-extrabold mt-1">1,042</p>
                            </div>
                        </div>

                        {/* Rejected */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-primary/10 custom-shadow flex flex-col justify-between group transition-all hover:border-accent-red">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-accent-red/10 text-accent-red group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">cancel</span>
                                </div>
                                <span className="text-accent-red text-xs font-bold bg-accent-red/5 px-2 py-1 rounded-md border border-accent-red/20">-2.1%</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Rejected</p>
                                <p className="text-3xl font-extrabold mt-1">86</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary/10 custom-shadow overflow-hidden">
                        <div className="p-6 border-b border-primary/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-96">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input className="w-full pl-12 pr-4 py-2.5 rounded-xl border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary text-sm transition-all" placeholder="Search by PR Number, Estate or Dept..." type="text" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-lg">filter_list</span>
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                    Oct 2023
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">PR Number</th>
                                        <th className="px-6 py-4">Date Submitted</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4">Estate Location</th>
                                        <th className="px-6 py-4">Total Value</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {/* Row 1 */}
                                    <tr onClick={() => navigate('/print-pr')} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-primary group-hover:underline">PR-2023-001</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Oct 24, 2023</td>
                                        <td className="px-6 py-4 text-sm">Operations</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                                <span className="text-sm">Bukit Darah</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">RM 45,000.00</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                                Approved
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors">more_horiz</span>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-primary group-hover:underline">PR-2023-002</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Oct 25, 2023</td>
                                        <td className="px-6 py-4 text-sm">Maintenance</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                                <span className="text-sm">Melati Estate</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">RM 12,800.00</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent-yellow/10 text-accent-yellow">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors">more_horiz</span>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-primary group-hover:underline">PR-2023-003</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Oct 25, 2023</td>
                                        <td className="px-6 py-4 text-sm">Logistics</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                                <span className="text-sm">Indah Island</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">RM 8,500.00</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                                Approved
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors">more_horiz</span>
                                        </td>
                                    </tr>
                                    {/* Row 4 */}
                                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-primary group-hover:underline">PR-2023-004</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Oct 26, 2023</td>
                                        <td className="px-6 py-4 text-sm">Operations</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                                <span className="text-sm">Bukit Darah</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">RM 32,000.00</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent-red/10 text-accent-red">
                                                Rejected
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors">more_horiz</span>
                                        </td>
                                    </tr>
                                    {/* Row 5 */}
                                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-primary group-hover:underline">PR-2023-005</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Oct 27, 2023</td>
                                        <td className="px-6 py-4 text-sm">Maintenance</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                                <span className="text-sm">Melati Estate</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">RM 15,200.00</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent-yellow/10 text-accent-yellow">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors">more_horiz</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 border-t border-primary/5 flex items-center justify-between">
                            <p className="text-sm text-gray-500">Showing 5 of 1,284 results</p>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                                <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-bold">1</button>
                                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">2</button>
                                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">3</button>
                                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PurchasingReport;
