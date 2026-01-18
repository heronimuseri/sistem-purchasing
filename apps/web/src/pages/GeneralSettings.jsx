import React from 'react';
import { useNavigate } from 'react-router-dom';

const GeneralSettings = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#161811] dark:text-[#f7f8f6] min-h-screen flex">
            {/* SideNavBar */}
            <aside className="w-64 border-r border-[#eef0ea] dark:border-[#2d3025] bg-background-light dark:bg-background-dark hidden md:flex flex-col sticky top-0 h-screen shrink-0">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-primary/10 rounded-lg p-2">
                            <span className="material-symbols-outlined text-primary text-3xl">potted_plant</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[#161811] dark:text-white text-base font-bold leading-tight">HO Plantation</h1>
                            <p className="text-[#7b865f] text-xs font-medium">Purchasing System</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1 grow">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 text-[#7b865f] hover:bg-primary/5 hover:text-primary rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-semibold">Dashboard</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2.5 text-[#7b865f] hover:bg-primary/5 hover:text-primary rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span className="text-sm font-semibold">Purchasing</span>
                        </button>
                        <button onClick={() => navigate('/goods-receipt')} className="flex items-center gap-3 px-3 py-2.5 text-[#7b865f] hover:bg-primary/5 hover:text-primary rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined">inventory_2</span>
                            <span className="text-sm font-semibold">Inventory</span>
                        </button>
                        <button onClick={() => navigate('/user-management')} className="flex items-center gap-3 px-3 py-2.5 text-[#7b865f] hover:bg-primary/5 hover:text-primary rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined">group</span>
                            <span className="text-sm font-semibold">Users</span>
                        </button>
                        <button onClick={() => navigate('/general-settings')} className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined active-icon filled-icon">settings</span>
                            <span className="text-sm font-bold">Settings</span>
                        </button>
                    </nav>
                    <div className="mt-auto pt-6 border-t border-[#eef0ea] dark:border-[#2d3025]">
                        <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-bold">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TopNavBar */}
                <header className="h-16 border-b border-[#eef0ea] dark:border-[#2d3025] flex items-center justify-between px-8 bg-white dark:bg-[#1b1d15] z-10 sticky top-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[#161811] dark:text-white text-lg font-bold tracking-tight">Admin Panel</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-6 mr-4">
                            <a className="text-[#7b865f] hover:text-primary text-sm font-semibold transition-colors" href="#">Profile</a>
                            <a className="text-[#7b865f] hover:text-primary text-sm font-semibold transition-colors" href="#">Help</a>
                            <a className="text-[#7b865f] hover:text-primary text-sm font-semibold transition-colors" href="#">Activity</a>
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                            Save Changes
                        </button>
                        <div className="h-9 w-9 rounded-full bg-cover bg-center border-2 border-primary/20" data-alt="User avatar of the system administrator" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDP2w9nuMrTFLx6xgTEum_Q-Fsi1SbB5ohYhFR-zXGGaBzyfNjRA9nDhdyP3ILUE1JEzZFlabT90WBIGWqKm9PJIBKrO8G_tufpyUUltw7ubD5Zw9zLAwgFonnzz91jBxU5j8yfyfqwGniX8pjE8sHsEluBKnmmUajnN1l59QvwdJ0gQ9xwT6HvmD8cwB_DrZAIY2I4i7ekz7_5XPSNhK3IJCn99tG_a-WBtme7kiVUzaepVYHQGy8dNaPnuJru877p2pPDVOemub0")' }}></div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* PageHeading */}
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[#161811] dark:text-white text-3xl font-extrabold tracking-tight">General System Settings</h1>
                            <p className="text-[#7b865f] text-base font-medium">Manage your company information and system-wide configurations.</p>
                        </div>
                        {/* Tabs */}
                        <div className="border-b border-[#eef0ea] dark:border-[#2d3025]">
                            <div className="flex gap-8">
                                <button className="border-b-2 border-primary pb-4 text-primary text-sm font-bold">
                                    General Settings
                                </button>
                                <button onClick={() => navigate('/master-user')} className="border-b-2 border-transparent pb-4 text-[#7b865f] hover:text-primary text-sm font-bold transition-colors">
                                    Roles & Permissions
                                </button>
                                <button onClick={() => navigate('/user-management')} className="border-b-2 border-transparent pb-4 text-[#7b865f] hover:text-primary text-sm font-bold transition-colors">
                                    User Management
                                </button>
                                <button onClick={() => navigate('/master-user')} className="border-b-2 border-transparent pb-4 text-[#7b865f] hover:text-primary text-sm font-bold transition-colors">
                                    Security
                                </button>
                            </div>
                        </div>
                        {/* Content Sections */}
                        <div className="grid gap-8">
                            {/* Section 1: Company Information */}
                            <section className="bg-white dark:bg-[#25281d] p-6 rounded-xl border border-[#eef0ea] dark:border-[#2d3025] shadow-sm">
                                <h2 className="text-[#161811] dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">business</span>
                                    Company Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[#7b865f] mb-1.5">Company Name</label>
                                            <input className="w-full bg-background-light dark:bg-[#1b1d15] border-[#eef0ea] dark:border-[#2d3025] rounded-lg focus:ring-primary focus:border-primary text-sm font-medium p-3" type="text" defaultValue="HO Plantation Sdn Bhd" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#7b865f] mb-1.5">Address</label>
                                            <textarea className="w-full bg-background-light dark:bg-[#1b1d15] border-[#eef0ea] dark:border-[#2d3025] rounded-lg focus:ring-primary focus:border-primary text-sm font-medium p-3" rows="3" defaultValue="No. 123, Level 15, Menara Plantation, Jalan Utama, 50450 Kuala Lumpur, Malaysia"></textarea>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-bold text-[#7b865f] mb-3">Company Logo</label>
                                        <div className="flex items-start gap-4">
                                            <div className="h-24 w-24 rounded-xl border-2 border-dashed border-[#eef0ea] dark:border-[#2d3025] flex items-center justify-center bg-background-light dark:bg-[#1b1d15] overflow-hidden group relative">
                                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                                    <span className="material-symbols-outlined text-primary">edit</span>
                                                </div>
                                                <div className="bg-primary/10 p-4 rounded-full">
                                                    <span className="material-symbols-outlined text-primary text-3xl">potted_plant</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Upload new logo</button>
                                                <p className="text-xs text-[#7b865f] leading-relaxed">Accepted formats: PNG, JPG, SVG. <br />Max size: 2MB. Recommended 256x256px.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Section 2: System Configuration */}
                            <section className="bg-white dark:bg-[#25281d] p-6 rounded-xl border border-[#eef0ea] dark:border-[#2d3025] shadow-sm">
                                <h2 className="text-[#161811] dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">settings_applications</span>
                                    System Configuration
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#7b865f] mb-1.5">Default Language</label>
                                        <select className="w-full bg-background-light dark:bg-[#1b1d15] border-[#eef0ea] dark:border-[#2d3025] rounded-lg focus:ring-primary focus:border-primary text-sm font-medium p-3" defaultValue="English (US)">
                                            <option>English (US)</option>
                                            <option>Bahasa Melayu</option>
                                            <option>Mandarin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#7b865f] mb-1.5">Timezone</label>
                                        <select className="w-full bg-background-light dark:bg-[#1b1d15] border-[#eef0ea] dark:border-[#2d3025] rounded-lg focus:ring-primary focus:border-primary text-sm font-medium p-3" defaultValue="(GMT+08:00) Kuala Lumpur">
                                            <option>(GMT+08:00) Kuala Lumpur</option>
                                            <option>(GMT+00:00) UTC</option>
                                            <option>(GMT+07:00) Bangkok</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#7b865f] mb-1.5">Date Format</label>
                                        <select className="w-full bg-background-light dark:bg-[#1b1d15] border-[#eef0ea] dark:border-[#2d3025] rounded-lg focus:ring-primary focus:border-primary text-sm font-medium p-3" defaultValue="DD / MM / YYYY">
                                            <option>DD / MM / YYYY</option>
                                            <option>MM / DD / YYYY</option>
                                            <option>YYYY - MM - DD</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                            {/* Section 3: Notification Settings */}
                            <section className="bg-white dark:bg-[#25281d] p-6 rounded-xl border border-[#eef0ea] dark:border-[#2d3025] shadow-sm mb-12">
                                <h2 className="text-[#161811] dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">notifications</span>
                                    Notification Settings
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#161811] dark:text-white">Email Notifications</h3>
                                            <p className="text-xs text-[#7b865f] font-medium">Receive system alerts and approval requests via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer toggle-checkbox" type="checkbox" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 toggle-label"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-[#eef0ea] dark:border-[#2d3025]">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#161811] dark:text-white">In-app Notifications</h3>
                                            <p className="text-xs text-[#7b865f] font-medium">Show alert badges and popups within the portal</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer toggle-checkbox" type="checkbox" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 toggle-label"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-[#eef0ea] dark:border-[#2d3025]">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#161811] dark:text-white">SMS Alerts</h3>
                                            <p className="text-xs text-[#7b865f] font-medium">Send critical priority alerts via SMS</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input className="sr-only peer toggle-checkbox" type="checkbox" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 toggle-label"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GeneralSettings;
