import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrintBPB = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#f3f4f1] dark:bg-zinc-900 min-h-screen font-display p-4 md:p-8 text-zinc-900">
            <div className="no-print max-w-[950px] mx-auto mb-6 flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-gray-500">arrow_back</span>
                    </button>
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary">description</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Preview BPB Document</h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Official BPB Document - Unit specific quantities focused</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        onClick={() => window.print()}
                    >
                        <span className="material-symbols-outlined text-lg">print</span>
                        Print PDF
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download
                    </button>
                </div>
            </div>

            <div className="print-container max-w-[950px] mx-auto bg-white dark:bg-background-light shadow-2xl print:shadow-none min-h-[1123px] flex flex-col">
                <header className="flex flex-col bg-primary text-white overflow-hidden">
                    <div className="flex items-center justify-between px-10 py-10">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-white p-1.5 rounded-lg">
                                    <svg className="size-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Sinar Permata Agro</h2>
                            </div>
                            <p className="text-white/80 text-xs font-medium tracking-wide">Jl. Perkebunan Sawit No. 128, Kalimantan Barat</p>
                        </div>
                        <div className="text-right border-l border-white/20 pl-10">
                            <h1 className="text-3xl font-black uppercase leading-tight tracking-tight">Bukti Penerimaan<br />Barang (BPB)</h1>
                        </div>
                    </div>
                    <div className="bg-black/10 h-2 w-full"></div>
                </header>

                <div className="px-10 py-8 grid grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-4">
                        <div className="border-b border-zinc-100 pb-2">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">BPB Number</p>
                            <p className="text-zinc-900 text-base font-bold">BPB/SPA/2023/1024</p>
                        </div>
                        <div className="border-b border-zinc-100 pb-2">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Date Received</p>
                            <p className="text-zinc-900 text-base font-bold">24 October 2023</p>
                        </div>
                        <div className="border-b border-zinc-100 pb-2">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Warehouse Location</p>
                            <p className="text-zinc-900 text-base font-bold">Gudang Utama HO - Sector Alpha</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="border-b border-zinc-100 pb-2">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Reference PO No</p>
                            <p className="text-zinc-900 text-base font-bold">PO-2023-00891</p>
                        </div>
                        <div className="border-b border-zinc-100 pb-2">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Vendor Name</p>
                            <p className="text-zinc-900 text-base font-bold uppercase">PT. Sarana Tani Jaya</p>
                        </div>
                        <div className="border-b border-zinc-100 pb-2">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Surat Jalan No</p>
                            <p className="text-zinc-900 text-base font-bold">SJ-99821-X-2023</p>
                        </div>
                    </div>
                </div>

                <div className="px-10 pb-8 flex-grow">
                    <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-primary"></span>
                        Received Items Details
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-zinc-200">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-200">
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider w-10 text-center">No</th>
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider w-[22%]">Item Description</th>
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider text-right w-16">Qty PO</th>
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider text-right w-16">Qty Rec</th>
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider w-16">Unit</th>
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider w-24">Condition</th>
                                    <th className="px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider">Keterangan Kerusakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                <tr className="hover:bg-zinc-50/50 align-top">
                                    <td className="px-3 py-4 text-[13px] text-zinc-500 text-center font-medium">01</td>
                                    <td className="px-3 py-4 text-[13px] font-bold text-zinc-900">Pupuk NPK Mutiara 16-16-16 High Grade</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-600 text-right font-semibold">500.00</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-900 text-right font-bold">500.00</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-600 uppercase font-medium tracking-wide">Sacks</td>
                                    <td className="px-3 py-4 text-[13px]">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-green-200">Good</span>
                                    </td>
                                    <td className="px-3 py-4 text-[12px] text-zinc-500 italic">—</td>
                                </tr>
                                <tr className="hover:bg-zinc-50/50 align-top">
                                    <td className="px-3 py-4 text-[13px] text-zinc-500 text-center font-medium">02</td>
                                    <td className="px-3 py-4 text-[13px] font-bold text-zinc-900">Herisida Roundup 480SL 20L Premium</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-600 text-right font-semibold">50.00</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-900 text-right font-bold">50.00</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-600 uppercase font-medium tracking-wide">Jerrycans</td>
                                    <td className="px-3 py-4 text-[13px]">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-green-200">Good</span>
                                    </td>
                                    <td className="px-3 py-4 text-[12px] text-zinc-500 italic">—</td>
                                </tr>
                                <tr className="hover:bg-zinc-50/50 align-top">
                                    <td className="px-3 py-4 text-[13px] text-zinc-500 text-center font-medium">03</td>
                                    <td className="px-3 py-4 text-[13px] font-bold text-zinc-900">Sprayer Elektrik Solo 425 German Tech</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-600 text-right font-semibold">10.00</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-900 text-right font-bold">9.00</td>
                                    <td className="px-3 py-4 text-[13px] text-zinc-600 uppercase font-medium tracking-wide">Units</td>
                                    <td className="px-3 py-4 text-[13px]">
                                        <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-orange-200">1 Unit Damaged</span>
                                    </td>
                                    <td className="px-3 py-4 text-[12px] text-zinc-700 leading-relaxed">
                                        Box kemasan sobek, tangki plastik mengalami keretakan pada bagian bawah sehingga terjadi kebocoran cairan saat diuji coba. Unit telah dipisahkan.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">General Notes</p>
                        <p className="text-sm text-zinc-700 leading-relaxed italic">The damaged unit of Sprayer Elektrik Solo 425 has been returned immediately with the driver for replacement. All other items are confirmed according to the PO specification.</p>
                    </div>
                </div>

                <div className="px-10 pb-12">
                    <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-primary"></span>
                        Documentation Evidence
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="aspect-video w-full rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 overflow-hidden group">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDPHfFUTSOnhVv5ojhH8dRs3awJNvdWp9t5EgEB9BNOdlbCz0fayT7ptUIgR0rBr_Wa9-9ANBdQMqWUXrRVWpOLxPgQL2CGkOwDaiNXgmj2HDAbI2mjxIpUD1TflakzymPttYpSGebZZt1QC8HU9PGe8e-haDHx7ntarQ7eov_6vMsml7kI7oVszqoWiTuxrUfCtiI8cD06wIW80rLcYmTCJTd4RluL5fGEameHtym2BxB1GQrsHUsFthJ5Fe93hZ0jxEddSR_dj4')" }}></div>
                            </div>
                            <p className="text-center text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Foto Surat Jalan (SJ)</p>
                        </div>
                        <div className="space-y-2">
                            <div className="aspect-video w-full rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdZn8s2nmLmxNicb1qB0tEoY2_tzOKnnJelFYoNz619MhBDEjxhZB8qz0j0IIoeREsjyX79HE3-mpmmg0OvBXSHEd5fWA9pOeitb6PLhSYl4I78YNJ2mXTy23jQ1nOTZe1dNK15fvei2Qf7DXnHV6t1A_J-VGynPFs8KpdOQTsp3A2spTXyjIIYsOtMkebXY0KNYxA2NuPj2hS90f7DVdHYHcBjufKF7h6JPMMimcRivgavbEs5B97FoxTfrIxi1r2_LbYnHX7P1I')" }}></div>
                            </div>
                            <p className="text-center text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Foto Fisik Barang</p>
                        </div>
                    </div>
                </div>

                <footer className="px-10 py-12 border-t border-zinc-100 bg-zinc-50 mt-auto">
                    <div className="grid grid-cols-3 gap-8">
                        <div className="text-center space-y-20">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Penerima (Gudang)</p>
                            <div className="space-y-1">
                                <div className="w-40 h-[1px] bg-zinc-300 mx-auto"></div>
                                <p className="text-sm font-bold text-zinc-900 uppercase">Ahmad Fauzi</p>
                                <p className="text-[10px] text-zinc-500 italic">Warehouse Staff</p>
                            </div>
                        </div>
                        <div className="text-center space-y-20">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Diperiksa (KTU/Mgr)</p>
                            <div className="space-y-1">
                                <div className="w-40 h-[1px] bg-zinc-300 mx-auto"></div>
                                <p className="text-sm font-bold text-zinc-900 uppercase">Siti Rohmah</p>
                                <p className="text-[10px] text-zinc-500 italic">Estate Manager</p>
                            </div>
                        </div>
                        <div className="text-center space-y-20">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pengirim (Vendor)</p>
                            <div className="space-y-1">
                                <div className="w-40 h-[1px] bg-zinc-300 mx-auto"></div>
                                <p className="text-sm font-bold text-zinc-900 uppercase">Driver / Sales</p>
                                <p className="text-[10px] text-zinc-500 italic">Official Representative</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 flex justify-between items-end border-t border-zinc-200 pt-6">
                        <div className="space-y-1">
                            <p className="text-[9px] text-zinc-400 font-medium">Document ID: <span className="font-bold">BPB-82910-SPA-2023-X</span></p>
                            <p className="text-[9px] text-zinc-400 font-medium">Generated by Purchasing System at 24 Oct 2023, 15:42 WIB</p>
                        </div>
                        <div className="flex items-center gap-2 grayscale opacity-50">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">ISO 9001 Certified</span>
                            <div className="size-6 bg-zinc-200 rounded"></div>
                        </div>
                    </div>
                </footer>
            </div>
            <p className="no-print text-center text-zinc-400 text-xs mt-8 mb-4">
                © 2023 Sinar Permata Agro. All rights reserved. Professional Document Management System.
            </p>
        </div>
    );
};

export default PrintBPB;
