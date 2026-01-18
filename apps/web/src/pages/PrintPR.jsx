import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrintPR = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 transition-colors duration-200 min-h-screen">
            <nav className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 hidden sm:block">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-olive p-2 rounded">
                            <span className="material-symbols-outlined text-white text-xl">agriculture</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-primary-olive">Sinar Permata Agro</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <button onClick={() => navigate('/dashboard')} className="text-slate-500 dark:text-slate-400 hover:text-primary-olive transition-colors">Dashboard</button>
                        <a className="text-slate-500 dark:text-slate-400 hover:text-primary-olive transition-colors" href="#">Inventory</a>
                        <a className="text-primary-olive border-b-2 border-primary-olive pb-1" href="#">Requests</a>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <button className="bg-primary-olive text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary-dark transition-colors" onClick={() => window.print()}>
                            <span className="material-symbols-outlined text-sm">print</span>
                            Print PR
                        </button>
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                            <span className="material-symbols-outlined text-xl">share</span>
                        </button>
                    </div>
                </div>
            </nav>
            <div className="no-print max-w-5xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider">
                <span>Procurement</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>Purchase Requests</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary-olive font-bold">SPA/PR/2023/4012</span>
            </div>
            <main className="max-w-5xl mx-auto px-4 pb-20 page-container">
                <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 document-sheet">
                    <div className="flex flex-col md:flex-row justify-between items-start border-b-4 border-primary-olive pb-8 mb-8 print-border">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-olive p-2 rounded">
                                    <span className="material-symbols-outlined text-white text-3xl">agriculture</span>
                                </div>
                                <h1 className="text-2xl font-extrabold text-primary-olive tracking-tight">PT. SINAR PERMATA AGRO</h1>
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed uppercase font-medium">
                                Jl. Jend. Sudirman No. 12, Level 18, Jakarta Selatan 12190<br />
                                Tel: (021) 555-0123 | Fax: (021) 555-0124<br />
                                Email: <span className="text-primary-olive">procurement@sinarpermata.com</span> | Web: www.sinarpermata.com
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 text-right">
                            <h2 className="text-3xl font-black text-primary-olive dark:text-primary-olive tracking-tighter mb-4">PURCHASE REQUEST</h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-left">
                                <span className="font-bold text-slate-400 uppercase">PR Number:</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">SPA/PR/2023/4012</span>
                                <span className="font-bold text-slate-400 uppercase">Date:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">October 24, 2023</span>
                                <span className="font-bold text-slate-400 uppercase">Requesting Dept:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Estate Operations - Kalimantan</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                        <div>
                            <h3 className="text-[10px] font-bold text-primary-olive dark:text-primary-olive uppercase border-b border-primary-olive/20 dark:border-primary-olive/30 pb-1 mb-3">Originating Department</h3>
                            <div className="text-xs space-y-1">
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Estate Operations - Block C</p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Sinar Permata Site Office - Kalimantan<br />
                                    Jl. Poros Samarinda-Bontang KM 45<br />
                                    Kutai Kartanegara, Kalimantan Timur
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold text-primary-olive dark:text-primary-olive uppercase border-b border-primary-olive/20 dark:border-primary-olive/30 pb-1 mb-3">Priority &amp; Delivery</h3>
                            <div className="text-xs space-y-1">
                                <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-primary-olive text-white font-bold rounded">URGENT</span>
                                    <span className="px-2 py-0.5 bg-olive-light text-primary-olive dark:bg-primary-olive/20 dark:text-primary-light font-medium rounded">OPERATIONAL</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <span className="font-medium text-slate-800 dark:text-slate-200">Required Date:</span> November 15, 2023<br />
                                    <span className="font-medium text-slate-800 dark:text-slate-200">Ship To:</span> Site Warehouse - Sector 4
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 overflow-hidden border border-primary-olive/30 dark:border-primary-olive/40 rounded-sm">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-primary-olive text-white">
                                    <th className="py-3 px-4 w-12 text-center font-bold">No</th>
                                    <th className="py-3 px-4 w-24 font-bold">Code</th>
                                    <th className="py-3 px-4 font-bold">Description of Goods</th>
                                    <th className="py-3 px-4 w-20 text-center font-bold">Qty</th>
                                    <th className="py-3 px-4 w-20 text-center font-bold">Unit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr className="align-top hover:bg-olive-light dark:hover:bg-primary-olive/5 transition-colors">
                                    <td className="py-4 px-4 text-center text-slate-500 font-medium">1</td>
                                    <td className="py-4 px-4 font-mono font-medium text-primary-olive">NPK-15</td>
                                    <td className="py-4 px-4">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Fertilizer NPK 15-15-15 (Premium Grade)</p>
                                        <p className="text-slate-500 text-[11px] leading-relaxed italic">Bulk packaging 50kg per sack. UV protected lining for plantation storage.</p>
                                    </td>
                                    <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">200</td>
                                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">Sacks</td>
                                </tr>
                                <tr className="align-top hover:bg-olive-light dark:hover:bg-primary-olive/5 transition-colors">
                                    <td className="py-4 px-4 text-center text-slate-500 font-medium">2</td>
                                    <td className="py-4 px-4 font-mono font-medium text-primary-olive">IRR-PUMP</td>
                                    <td className="py-4 px-4">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Diesel Water Pump 4" High Flow</p>
                                        <p className="text-slate-500 text-[11px] leading-relaxed italic">Model SPA-DP4. Includes maintenance kit &amp; standard hose 20m.</p>
                                    </td>
                                    <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">4</td>
                                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">Units</td>
                                </tr>
                                <tr className="align-top hover:bg-olive-light dark:hover:bg-primary-olive/5 transition-colors">
                                    <td className="py-4 px-4 text-center text-slate-500 font-medium">3</td>
                                    <td className="py-4 px-4 font-mono font-medium text-primary-olive">LAB-KIT</td>
                                    <td className="py-4 px-4">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Soil pH Testing Digital Probe</p>
                                        <p className="text-slate-500 text-[11px] leading-relaxed italic">Calibration certificate included. Water resistant casing for field use.</p>
                                    </td>
                                    <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">10</td>
                                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">Units</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-12">
                        <h3 className="text-[10px] font-bold text-primary-olive dark:text-primary-olive uppercase border-b border-primary-olive/20 dark:border-primary-olive/30 pb-1 mb-3">Reason for Request</h3>
                        <div className="p-4 bg-olive-light dark:bg-primary-olive/10 rounded border border-primary-olive/20 dark:border-primary-olive/30 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                            Necessary replenishment of NPK stocks for Q4 planting schedule. Additional water pumps required for irrigation upgrade in Sector 4 to mitigate dry season risks. Soil probes are replacements for damaged units to maintain monitoring accuracy.
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-center pt-8 border-t border-primary-olive/10 dark:border-primary-olive/20">
                        <div className="space-y-16">
                            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Requested By</h4>
                            <div className="border-t border-primary-olive/30 dark:border-primary-olive/50 pt-2 mx-4">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sarah Adisti</p>
                                <p className="text-[10px] text-slate-500">Date: ___/___/2023</p>
                            </div>
                            <p className="text-[9px] font-bold text-primary-olive uppercase">REQUESTER</p>
                        </div>
                        <div className="space-y-16">
                            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Reviewed By</h4>
                            <div className="border-t border-primary-olive/30 dark:border-primary-olive/50 pt-2 mx-4">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Bambang Irawan</p>
                                <p className="text-[10px] text-slate-500">Date: ___/___/2023</p>
                            </div>
                            <p className="text-[9px] font-bold text-primary-olive uppercase">DEPT. HEAD</p>
                        </div>
                        <div className="space-y-16">
                            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Approved By</h4>
                            <div className="border-t border-primary-olive/30 dark:border-primary-olive/50 pt-2 mx-4">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ir. Sudrajat K.</p>
                                <p className="text-[10px] text-slate-500">Date: ___/___/2023</p>
                            </div>
                            <p className="text-[9px] font-bold text-primary-olive uppercase">ESTATE MANAGER</p>
                        </div>
                    </div>
                    <div className="mt-20 border-t border-dashed border-primary-olive/20 dark:border-primary-olive/40 pt-4 flex justify-between items-center text-[9px] text-primary-olive/60 dark:text-primary-olive/70 uppercase font-semibold">
                        <span>DIGITAL COPY - GENERATED BY SPA ENTERPRISE RESOURCE PLANNING SYSTEM</span>
                        <span>PAGE 1 OF 1</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrintPR;
