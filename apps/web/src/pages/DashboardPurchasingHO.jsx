import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPurchasingHO = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#181211] dark:text-white transition-colors duration-200 min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[#e1d7d5] dark:border-[#3d312f] bg-white dark:bg-[#1d1615] flex flex-col sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">agriculture</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-tight text-primary">HO Plantation</h1>
                        <p className="text-[#86645f] text-xs">Purchasing System</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#181211] dark:text-[#f0ebea] hover:bg-primary/10 transition-colors w-full text-left">
                        <span className="material-symbols-outlined text-lg">grid_view</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#181211] dark:text-[#f0ebea] hover:bg-primary/10 transition-colors w-full text-left">
                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                        <span className="text-sm font-medium">Purchasing</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#181211] dark:text-[#f0ebea] hover:bg-primary/10 transition-colors w-full text-left">
                        <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                        <span className="text-sm font-medium">Payment</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg active-nav w-full text-left">
                        <span className="material-symbols-outlined text-lg">monitoring</span>
                        <span className="text-sm font-medium">Report Purchasing</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-[#e1d7d5] dark:border-[#3d312f]">
                    <div className="bg-primary/5 dark:bg-primary/20 rounded-lg p-4">
                        <p className="text-xs font-bold text-primary dark:text-primary/80 uppercase tracking-wider mb-1">System Health</p>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-green-500"></div>
                            <p className="text-xs text-[#86645f] dark:text-[#a18c89]">All services operational</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-background-light">
                <header className="h-16 border-b border-[#e1d7d5] dark:border-[#3d312f] bg-white dark:bg-[#1d1615] flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#86645f]">search</span>
                            <input className="w-full bg-[#f0ebea] dark:bg-[#2d2422] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 placeholder-[#86645f]" placeholder="Search PR numbers, items, or vendors..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-[#181211] dark:text-[#f0ebea] hover:bg-[#f0ebea] dark:hover:bg-[#2d2422] rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 size-2.5 bg-red-600 border-2 border-white dark:border-[#1d1615] rounded-full"></span>
                        </button>
                        <div className="h-8 w-px bg-[#e1d7d5] dark:border-[#3d312f]"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold leading-none">Andi Pratama</p>
                                <p className="text-[10px] text-[#86645f] font-medium uppercase tracking-tighter">Head Office Admin</p>
                            </div>
                            <div className="size-9 rounded-full bg-center bg-cover bg-[#e1d7d5]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBz_DB1B-81CkAiTrbr6bmnvZI_ZgclMJw_sT9bEg-IzcgCqv4y-UmH9Maswnzm93BUkxajAggCrjb9KpmsJCda1T_HdN0kJCzXUwob3Rhxje0l4HISKko1D1dlWpaZMxfV14NEsLtnGxZi1AtuvcTY7GlvOr8qSlAizn0AySvvux-owwDpH_-2EcB9BkaRA16XDFPjFjYQg5jywkekMdwU2CtWLJmHCpkwTqn-a5bGTbvnR_Lc4GaSSkusjxbarcou6htqq6bC3M4')" }}></div>
                        </div>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-[#181211] dark:text-white tracking-tight">Purchasing Overview</h2>
                        <p className="text-[#86645f] dark:text-[#a18c89] mt-1">Real-time procurement performance and operational status.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-[#1d1615] p-6 rounded-xl border border-[#e1d7d5] dark:border-[#3d312f] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                                    <span className="material-symbols-outlined">assignment_late</span>
                                </div>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Needs Action</span>
                            </div>
                            <p className="text-[#86645f] dark:text-[#a18c89] text-sm font-medium">PR Outstanding</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold mt-1">18</p>
                                <p className="text-xs text-[#86645f]">Waiting for PO</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1d1615] p-6 rounded-xl border border-[#e1d7d5] dark:border-[#3d312f] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                    <span className="material-symbols-outlined">local_shipping</span>
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">In Transit</span>
                            </div>
                            <p className="text-[#86645f] dark:text-[#a18c89] text-sm font-medium">PO Outstanding</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold mt-1">34</p>
                                <p className="text-xs text-[#86645f]">Active Orders</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1d1615] p-6 rounded-xl border border-[#e1d7d5] dark:border-[#3d312f] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">timer</span>
                                </div>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">85% Target</span>
                            </div>
                            <p className="text-[#86645f] dark:text-[#a18c89] text-sm font-medium">KPI Purchasing</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold mt-1 text-primary">2.4</p>
                                <p className="text-xs text-[#86645f]">Avg. Days (PR to PO)</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1d1615] p-6 rounded-xl border border-[#e1d7d5] dark:border-[#3d312f] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600">
                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                </div>
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">Pending GR</span>
                            </div>
                            <p className="text-[#86645f] dark:text-[#a18c89] text-sm font-medium">Outstanding Payment</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold mt-1 text-red-600">12</p>
                                <p className="text-xs text-[#86645f]">Invoices Due</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-2 bg-white dark:bg-[#1d1615] rounded-xl border border-[#e1d7d5] dark:border-[#3d312f] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-[#181211] dark:text-white">Purchasing Performance</h3>
                                    <p className="text-sm text-[#86645f]">Total Purchasing Value (Paid POs - Last 12 Months)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary">Rp 4.28B</p>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">↑ 14% Annual Growth</span>
                                </div>
                            </div>
                            <div className="h-48 flex items-end gap-2 px-2">
                                <div className="flex-1 bg-plantation-green/20 h-[30%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[45%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[35%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[60%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[55%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[70%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[65%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[80%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[75%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[85%] rounded-t"></div>
                                <div className="flex-1 bg-plantation-green/20 h-[90%] rounded-t"></div>
                                <div className="flex-1 bg-primary h-[95%] rounded-t"></div>
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-[#86645f] uppercase tracking-wider px-2">
                                <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span className="text-primary font-black">Oct</span>
                            </div>
                        </div>
                        <div className="bg-primary p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-white">receipt_long</span>
                                </div>
                                <h4 className="text-lg font-bold">Financial Summary</h4>
                                <p className="text-white/70 text-sm">Monthly expenditure tracking</p>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="text-sm font-medium">Total Paid (Oct)</span>
                                    <span className="font-bold">Rp 450M</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="text-sm font-medium">Pending GR</span>
                                    <span className="font-bold">Rp 128M</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Budget Utilization</span>
                                    <span className="font-bold">78.4%</span>
                                </div>
                            </div>
                            <button className="mt-6 w-full bg-white text-primary font-bold py-2.5 rounded-lg text-sm hover:bg-plantation-cream transition-colors">
                                Download Report
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1d1615] rounded-xl border border-[#e1d7d5] dark:border-[#3d312f] overflow-hidden shadow-sm mb-10">
                        <div className="px-6 py-5 border-b border-[#e1d7d5] dark:border-[#3d312f] flex justify-between items-center bg-plantation-cream/50 dark:bg-[#241c1a]">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pie_chart</span>
                                <h3 className="text-lg font-bold text-[#181211] dark:text-white">Total PO Value by Material Category</h3>
                            </div>
                            <span className="text-xs font-bold text-[#86645f] uppercase tracking-wider">Fiscal Year 2023</span>
                        </div>
                        <div className="p-8">
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold w-24">PUPUK</span>
                                            <span className="text-lg font-black text-primary">Rp 1.84B</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">43%</span>
                                    </div>
                                    <div className="w-full bg-[#f0ebea] dark:bg-[#2d2422] rounded-full h-3 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '43%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold w-24">BBM</span>
                                            <span className="text-lg font-black text-primary">Rp 1.02B</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">24%</span>
                                    </div>
                                    <div className="w-full bg-[#f0ebea] dark:bg-[#2d2422] rounded-full h-3 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '24%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold w-24">SPAREPART</span>
                                            <span className="text-lg font-black text-primary">Rp 728M</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">17%</span>
                                    </div>
                                    <div className="w-full bg-[#f0ebea] dark:bg-[#2d2422] rounded-full h-3 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '17%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold w-24">HERBISIDA</span>
                                            <span className="text-lg font-black text-primary">Rp 470M</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">11%</span>
                                    </div>
                                    <div className="w-full bg-[#f0ebea] dark:bg-[#2d2422] rounded-full h-3 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '11%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold w-24">UMUM</span>
                                            <span className="text-lg font-black text-primary">Rp 214M</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">5%</span>
                                    </div>
                                    <div className="w-full bg-[#f0ebea] dark:bg-[#2d2422] rounded-full h-3 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '5%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-[#e1d7d5] dark:border-[#3d312f] flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-[#86645f] uppercase tracking-widest mb-1">Grand Total Expenditure</p>
                                    <p className="text-3xl font-black text-[#181211] dark:text-white">Rp 4,272,000,000</p>
                                </div>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#f0ebea] dark:bg-[#2d2422] hover:bg-primary/10 text-primary font-bold rounded-lg transition-colors text-sm">
                                    <span className="material-symbols-outlined text-sm">dashboard</span>
                                    Category Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPurchasingHO;
