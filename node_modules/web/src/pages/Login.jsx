import React from 'react';

const Login = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-10 py-4 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-forest-charcoal dark:text-white">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">agriculture</span>
                        </div>
                        <h2 className="text-lg font-extrabold leading-tight tracking-tight">HO Plantation <span className="font-normal text-primary">Purchasing</span></h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Corporate ERP</p>
                            <p className="text-[10px] text-forest-charcoal/60 dark:text-white/60">v2.4.0-stable</p>
                        </div>
                        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">language</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-[460px] animate-in fade-in zoom-in duration-500">
                        {/* Login Card */}
                        <div className="bg-white dark:bg-[#2a2d26] rounded-xl shadow-[0_20px_50px_rgba(44,58,41,0.12)] overflow-hidden border border-white/20">
                            {/* Gradient Header Section */}
                            <div className="glass-gradient p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome Back</h1>
                                    <p className="text-white/80 text-sm font-light">Access the HO Plantation Purchasing Hub</p>
                                </div>
                                {/* Abstract Organic Shapes for flair */}
                                <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute -left-10 -bottom-10 size-32 bg-black/10 rounded-full blur-2xl"></div>
                            </div>

                            {/* Form Section */}
                            <div className="p-8 space-y-5">
                                {/* Company ID Field */}
                                <div className="space-y-2">
                                    <label className="text-forest-charcoal dark:text-white/80 text-sm font-semibold ml-1">Company ID</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
                                            <span className="material-symbols-outlined text-[20px]">domain</span>
                                        </div>
                                        <input
                                            className="w-full pl-11 pr-4 py-3.5 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary/30 focus:ring-0 rounded-lg text-forest-charcoal dark:text-white transition-all duration-200 placeholder:text-forest-charcoal/30"
                                            placeholder="SPA_70"
                                            type="text"
                                        />
                                    </div>
                                </div>

                                {/* User ID Field */}
                                <div className="space-y-2">
                                    <label className="text-forest-charcoal dark:text-white/80 text-sm font-semibold ml-1">User ID</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
                                            <span className="material-symbols-outlined text-[20px]">person</span>
                                        </div>
                                        <input
                                            className="w-full pl-11 pr-4 py-3.5 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary/30 focus:ring-0 rounded-lg text-forest-charcoal dark:text-white transition-all duration-200 placeholder:text-forest-charcoal/30"
                                            placeholder="Enter your User ID"
                                            type="text"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-forest-charcoal dark:text-white/80 text-sm font-semibold">Password</label>
                                        <a className="text-primary text-xs font-bold hover:underline" href="#">Forgot?</a>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                        </div>
                                        <input
                                            className="w-full pl-11 pr-12 py-3.5 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary/30 focus:ring-0 rounded-lg text-forest-charcoal dark:text-white transition-all duration-200 placeholder:text-forest-charcoal/30"
                                            placeholder="••••••••"
                                            type="password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-forest-charcoal/40 hover:text-primary">
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                                >
                                    <span>LOGIN</span>
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </button>

                                <div className="pt-4 flex items-center justify-center gap-2">
                                    <span className="h-px w-8 bg-forest-charcoal/10"></span>
                                    <p className="text-[11px] text-forest-charcoal/40 dark:text-white/40 uppercase tracking-widest font-bold">Secure Access</p>
                                    <span className="h-px w-8 bg-forest-charcoal/10"></span>
                                </div>
                            </div>
                        </div>

                        {/* Assistance Card */}
                        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                            <div className="size-10 rounded-full bg-white dark:bg-background-dark flex items-center justify-center text-primary shadow-sm">
                                <span className="material-symbols-outlined">support_agent</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-forest-charcoal dark:text-white/90">Need assistance?</p>
                                <p className="text-xs text-forest-charcoal/60 dark:text-white/60">Contact IT Support at ext. 4455</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-8 px-10 border-t border-primary/5">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <img
                                alt="HO Plantation Logo"
                                className="h-8 opacity-50 grayscale hover:grayscale-0 transition-all"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp0s5PsS59x-8EK0JZ6KDjGH8IaJxMFXZTQ15V90OwZvahn2fcVC4jK7x0nu4g0ggboWO7Ag8xnTLrJPG5Go68QBUHeNOfnlIJushDpx0--JErY0dP3DaVVIR7_iEUV_xRtO9SSuMP2NqLuucegwuIoX29jtHjkpoMF8d1dK7e_nyVC7E5OFZ0m48UKyff2jwtPu_CzzgJRv1bmiv7FG3KbLeks7Q6aJMaOgofZ8PR8ujYdYZJFlkhVqmxKQFdnQPl1SKkEVXltgk"
                            />
                            <p className="text-xs text-forest-charcoal/40 dark:text-white/40">© 2024 HO Plantation Group. All rights reserved.</p>
                        </div>
                        <div className="flex gap-6">
                            <a className="text-xs text-forest-charcoal/40 dark:text-white/40 hover:text-primary" href="#">Privacy Policy</a>
                            <a className="text-xs text-forest-charcoal/40 dark:text-white/40 hover:text-primary" href="#">Terms of Service</a>
                            <a className="text-xs text-forest-charcoal/40 dark:text-white/40 hover:text-primary" href="#">System Status</a>
                        </div>
                    </div>
                </footer>

                {/* Decorative background element */}
                <div className="fixed bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-tl-[100%] -z-10 blur-3xl pointer-events-none"></div>
                <div className="fixed top-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-br-[100%] -z-10 blur-3xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Login;
