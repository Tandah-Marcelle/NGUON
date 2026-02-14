import { useState, useEffect } from "react";
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
    Bell,
    Activity,
    MessageSquare,
    Mail,
    Users,
    MapPin
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authService } from "@/lib/auth";

const AdminLayout = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [username, setUsername] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = authService.getUsername();
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Close sidebar on route change on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);
    const menuItems = [
        { icon: LayoutDashboard, label: t('admin.sidebar.dashboard'), path: "/admin/dashboard" },
        { icon: Image, label: t('admin.sidebar.media'), path: "/admin/media" },
        { icon: Calendar, label: t('admin.sidebar.programme'), path: "/admin/programme" },
        { icon: Activity, label: t('admin.sidebar.activities'), path: "/admin/activities" },
        { icon: MessageSquare, label: t('admin.sidebar.messages'), path: "/admin/messages" },
        { icon: Mail, label: t('admin.sidebar.contacts'), path: "/admin/contacts" },
        { icon: MapPin, label: "Sites", path: "/admin/sites" },
        { icon: Users, label: t('admin.sidebar.users'), path: "/admin/users" },
        { icon: ShieldCheck, label: t('admin.sidebar.roles'), path: "/admin/roles" },
    ];

    const handleLogout = () => {
        authService.logout();
        toast.success(t('admin.sidebar.logout_success'));
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-background flex text-slate-900 dark:text-slate-100 relative">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-[#003B5C] text-white shadow-2xl md:relative h-screen flex flex-col"
                    >
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-10">
                                <img
                                    src="/img/logo2.png"
                                    alt="Admin Logo"
                                    className="h-12 w-auto object-contain"
                                />
                                <h1 className="font-display font-bold text-xl tracking-tight leading-tight">{t('admin.sidebar.title')}</h1>
                            </div>

                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${location.pathname === item.path
                                            ? "bg-secondary text-[#003B5C] font-bold shadow-lg shadow-secondary/20"
                                            : "hover:bg-white/10 text-white/70 hover:text-white"
                                            }`}
                                    >
                                        <item.icon size={20} className={location.pathname === item.path ? "" : "group-hover:scale-110 transition-transform"} />
                                        <span className="font-body text-sm tracking-wide">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="mt-auto p-8">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                            >
                                <LogOut size={20} />
                                <span className="font-body text-sm font-medium">{t('admin.sidebar.logout')}</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-[#002B44]/5 relative">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors md:hidden"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2 className="font-display font-bold text-lg md:text-xl text-slate-800 dark:text-white truncate max-w-[200px] md:max-w-none">
                            {menuItems.find(item => item.path === location.pathname)?.label || t('admin.sidebar.title')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l md:border-slate-200 md:dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{username || t('admin.header.admin_label')}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{t('admin.header.super_admin')}</p>
                            </div>
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 overflow-hidden">
                                <UserCircle size={24} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Container */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div >
    );
};

export default AdminLayout;
