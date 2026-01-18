import React from 'react';
import { useNavigate } from 'react-router-dom';

const InputBPB = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark text-forest dark:text-gray-100 min-h-screen flex font-display">
            <aside className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-background-dark sticky top-0 h-screen shrink-0">
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
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span className="text-sm font-semibold">Purchasing</span>
                    </button>
                    <button onClick={() => navigate('/goods-receipt')} className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl transition-colors text-left">
                        <span className="material-symbols-outlined filled-icon">warehouse</span>
                        <span className="text-sm font-bold">Gudang</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-sm font-semibold">Inventory</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm font-semibold">Finance</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="text-sm font-semibold">Reports</span>
                    </button>
                </nav>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        <span>New Entry</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col">
                <header className="h-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <button onClick={() => navigate('/goods-receipt')} className="hover:text-primary transition-colors">Gudang</button>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <button onClick={() => navigate('/goods-receipt')} className="hover:text-primary transition-colors">Penerimaan Barang</button>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-forest dark:text-white">Input BPB</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
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
                <div className="p-8 max-w-[1440px] w-full mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-forest dark:text-white tracking-tight">Input Penerimaan Barang (BPB)</h2>
                            <p className="text-gray-500 font-medium">Create a new Goods Receipt for received Purchase Orders.</p>
                        </div>
                        <button onClick={() => navigate('/goods-receipt')} className="flex items-center gap-2 text-primary font-bold hover:underline">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back to List
                        </button>
                    </div>
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-background-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-800 pb-4">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    <h3 className="font-bold text-lg">PO Reference</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-wider text-gray-400">Pilih No. Purchase Order</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                            <select className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white appearance-none">
                                                <option value="">Search PO Number...</option>
                                                <option value="PO-2023-08-001">PO-2023-08-001</option>
                                                <option value="PO-2023-08-105">PO-2023-08-105</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase tracking-wider text-gray-400">No. Surat Jalan Vendor</label>
                                            <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white" placeholder="Ex: SJ-2023-991" type="text" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase tracking-wider text-gray-400">Tanggal Terima</label>
                                            <div className="relative">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white" type="date" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/20 space-y-6">
                                <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                                    <h3 className="font-bold text-lg text-primary">Vendor Info</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-wider text-primary/60">Vendor Name</p>
                                        <p className="text-base font-bold text-forest dark:text-white">PT. Pupuk Sriwidjaja</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-wider text-primary/60">Address</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Jl. Mayor Zen, Kalidoni, Kec. Kalidoni, Kota Palembang, Sumatera Selatan 30118, Indonesia</p>
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-primary">call</span>
                                            <span className="text-xs font-medium">+62 711-712-222</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-primary">mail</span>
                                            <span className="text-xs font-medium">contact@pusri.co.id</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-background-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="font-extrabold text-forest dark:text-white">Daftar Barang (Item List)</h3>
                                <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full">4 Items total</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800">Nama Barang</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800 w-28">Qty PO</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800 w-24 text-center">Satuan</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800 w-32">Qty Diterima</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800 w-40">Kondisi</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 border-b border-gray-100 dark:border-gray-800">Keterangan Kerusakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        <tr>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-forest dark:text-white line-clamp-1">Pupuk Urea Granular</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">SKU: FERT-001-URG</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-forest dark:text-white">1,500</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">KG</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white font-bold" type="number" defaultValue="1500" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white">
                                                    <option value="Good">Good</option>
                                                    <option value="Damaged">Damaged</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white placeholder:text-gray-400 placeholder:italic" placeholder="Detail kerusakan..." type="text" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-forest dark:text-white line-clamp-1">NPK Mutiara 16-16-16</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">SKU: FERT-002-NPK</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-forest dark:text-white">800</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">KG</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white font-bold" type="number" defaultValue="800" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white">
                                                    <option value="Good">Good</option>
                                                    <option value="Damaged">Damaged</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white placeholder:text-gray-400 placeholder:italic" placeholder="Detail kerusakan..." type="text" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-forest dark:text-white line-clamp-1">Pestisida Roundup 480SL</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">SKU: CHEM-005-RND</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-forest dark:text-white">20</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">LITER</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-red-200 focus:border-red-400 rounded-lg px-3 py-2 text-sm focus:ring-0 text-red-600 font-bold" type="number" defaultValue="18" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white" defaultValue="Damaged">
                                                    <option value="Good">Good</option>
                                                    <option value="Damaged">Damaged</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-primary/20 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white placeholder:text-gray-400 placeholder:italic" placeholder="Detail kerusakan..." type="text" defaultValue="Tutup botol pecah 2 pcs" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-background-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">Foto Surat Jalan</label>
                                    <span className="text-[10px] text-primary/60 font-medium bg-primary/5 px-2 py-0.5 rounded">Required</span>
                                </div>
                                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
                                    <input accept=".jpg,.png,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                        </div>
                                        <p className="text-sm font-bold text-forest dark:text-white">Klik untuk upload atau drag & drop</p>
                                        <p className="text-[11px] text-gray-400 mt-1">Format: JPG, PNG, PDF (Maks. 5MB)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-background-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">Foto Fisik Barang</label>
                                    <span className="text-[10px] text-primary/60 font-medium bg-primary/5 px-2 py-0.5 rounded">Optional</span>
                                </div>
                                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
                                    <input accept=".jpg,.png,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl">photo_camera</span>
                                        </div>
                                        <p className="text-sm font-bold text-forest dark:text-white">Klik untuk upload atau drag & drop</p>
                                        <p className="text-[11px] text-gray-400 mt-1">Format: JPG, PNG, PDF (Maks. 5MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-8 space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-400">Catatan Penerimaan</label>
                                <textarea className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-forest dark:text-white" placeholder="Tambahkan informasi tambahan jika ada (misal: barang kurang, kemasan rusak sebagian, dll)..." rows="4"></textarea>
                            </div>
                            <div className="lg:col-span-4 flex flex-col gap-4 self-end">
                                <div className="flex gap-3">
                                    <button onClick={() => navigate('/goods-receipt')} className="flex-1 px-6 py-4 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm" type="button">
                                        Batal
                                    </button>
                                    <button className="flex-[2] px-6 py-4 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 text-sm flex items-center justify-center gap-2" type="submit">
                                        <span className="material-symbols-outlined filled-icon">task_alt</span>
                                        Simpan BPB
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default InputBPB;
