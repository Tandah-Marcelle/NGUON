import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Image,
    Calendar,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    UserCircle,
    Bell
} from "lucide-react";
import { toast } from "sonner";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Image, label: "Galerie Média", path: "/admin/media" },
        { icon: Calendar, label: "Programme", path: "/admin/programme" },
        { icon: ShieldCheck, label: "Rôles & Accès", path: "/admin/roles" },
    ];

    const handleLogout = () => {
        toast.success("Déconnexion réussie");
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-background flex text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-[#003B5C] text-white shadow-2xl md:relative h-screen"
                    >
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-12">
                                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-[#003B5C] font-bold text-xl shadow-lg">
                                    N
                                </div>
                                <h1 className="font-display font-bold text-2xl tracking-tight">Admin</h1>
                            </div>

                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${location.pathname === item.path
                                                ? "bg-secondary text-[#003B5C] font-bold shadow-lg shadow-secondary/20"
                                                : "hover:bg-white/10 text-white/70 hover:text-white"
                                            }`}
                                    >
                                        <item.icon size={22} className={location.pathname === item.path ? "" : "group-hover:scale-110 transition-transform"} />
                                        <span className="font-body text-sm tracking-wide">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="absolute bottom-4 left-0 w-full px-8">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                            >
                                <LogOut size={22} />
                                <span className="font-body text-sm font-medium">Déconnexion</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-[#002B44]/5 relative">
                {/* Top Navbar */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors md:hidden"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white">
                            {menuItems.find(item => item.path === location.pathname)?.label || "Administration"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">Administrateur</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 overflow-hidden">
                                <UserCircle size={24} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Container */}
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
