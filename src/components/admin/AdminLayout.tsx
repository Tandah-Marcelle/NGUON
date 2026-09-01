import { useState, useEffect, Suspense } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Image, Calendar, ShieldCheck, LogOut,
    Menu, X, UserCircle, Bell, Activity, MessageSquare, Mail,
    Users, MapPin, Award, ArrowLeft, Trophy, ShoppingBag,
    Tag, ClipboardList, ChevronDown, UserCog, Medal, ListChecks, Star,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authService } from "@/lib/auth";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const AdminContentSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-8 w-56 bg-slate-200 dark:bg-white/8 rounded-xl" />
                <div className="h-4 w-80 bg-slate-200 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="h-10 w-36 bg-slate-200 dark:bg-white/8 rounded-xl" />
        </div>
        <div className="h-11 w-full bg-slate-200 dark:bg-white/5 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-white/5 rounded-2xl" />)}
        </div>
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-white/5 rounded-2xl" />)}
        </div>
    </div>
);

// ─── Types ─────────────────────────────────────────────────────────────────────
type SubItem = { icon: React.ElementType; label: string; path: string };

// ─── Collapsible sidebar group ────────────────────────────────────────────────
const SidebarGroup = ({
    icon: Icon, label, matchPaths, children, isActive,
}: {
    icon: React.ElementType; label: string; matchPaths: string[];
    children: SubItem[]; isActive: boolean;
}) => {
    const location = useLocation();
    const [open, setOpen] = useState(() => matchPaths.some(p => location.pathname.startsWith(p)));

    useEffect(() => {
        if (matchPaths.some(p => location.pathname.startsWith(p))) setOpen(true);
    }, [location.pathname]);

    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                        ? "bg-secondary/20 text-white font-bold"
                        : "hover:bg-white/10 text-white/70 hover:text-white"
                }`}
            >
                <Icon size={18} className="flex-shrink-0" />
                <span className="font-body text-sm tracking-wide flex-1 text-left">{label}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden pl-3 mt-0.5 space-y-0.5"
                    >
                        {children.map(sub => {
                            const active = location.pathname === sub.path || location.pathname.startsWith(sub.path + "/");
                            return (
                                <Link
                                    key={sub.path}
                                    to={sub.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm ${
                                        active
                                            ? "bg-secondary text-[#003B5C] font-bold shadow-sm"
                                            : "hover:bg-white/10 text-white/55 hover:text-white"
                                    }`}
                                >
                                    <sub.icon size={15} className="flex-shrink-0" />
                                    <span className="font-body tracking-wide">{sub.label}</span>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Simple sidebar link ───────────────────────────────────────────────────────
const SidebarLink = ({ icon: Icon, label, path }: { icon: React.ElementType; label: string; path: string }) => {
    const location = useLocation();
    const active = location.pathname === path || location.pathname.startsWith(path + "/");
    return (
        <Link
            to={path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                active
                    ? "bg-secondary text-[#003B5C] font-bold shadow-lg shadow-secondary/20"
                    : "hover:bg-white/10 text-white/70 hover:text-white"
            }`}
        >
            <Icon size={18} className={active ? "flex-shrink-0" : "group-hover:scale-110 transition-transform flex-shrink-0"} />
            <span className="font-body text-sm tracking-wide">{label}</span>
        </Link>
    );
};

const Divider = () => (
    <div className="py-1.5"><div className="h-px bg-white/10" /></div>
);

// ─── Main layout ───────────────────────────────────────────────────────────────
const AdminLayout = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [username, setUsername] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = authService.getUsername();
        if (stored) setUsername(stored);
    }, []);

    // Session lock-out: checked on every admin navigation and on a recurring
    // timer, so an expired token forces a logout no matter which admin page
    // is open — not just ones that happen to call the API.
    useEffect(() => {
        const checkSession = () => {
            if (!authService.isAuthenticated()) {
                authService.logout();
                toast.error(t("admin.sidebar.session_expired"));
                navigate("/admin/login", { replace: true });
            }
        };
        checkSession();
        const interval = setInterval(checkSession, 30000);
        return () => clearInterval(interval);
    }, [location.pathname, navigate, t]);

    useEffect(() => {
        const onResize = () => setIsSidebarOpen(window.innerWidth >= 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    }, [location.pathname]);

    // Header title map
    const titleMap: Record<string, string> = {
        "/admin/dashboard":       t("admin.sidebar.dashboard"),
        "/admin/media":           t("admin.sidebar.media"),
        "/admin/programme":       t("admin.sidebar.programme"),
        "/admin/activities":      t("admin.sidebar.activities"),
        "/admin/actualities":     t("admin.sidebar.actualities"),
        "/admin/sponsors":        t("admin.sidebar.sponsors"),
        "/admin/messages":        t("admin.sidebar.messages"),
        "/admin/contacts":        t("admin.sidebar.contacts"),
        "/admin/sites":           "Sites",
        "/admin/booking":          "Hôtels & Restaurants",
        "/admin/concours":        "Concours",
        "/admin/candidats":       "Candidats",
        "/admin/vote-profiles":   "Votes",
        "/admin/users":           t("admin.sidebar.users"),
        "/admin/roles":           t("admin.sidebar.roles"),
        "/admin/shop/products":   "Produits — Boutique",
        "/admin/shop/categories": "Catégories — Boutique",
        "/admin/shop/orders":     "Commandes — Boutique",
    };
    const pageTitle = Object.entries(titleMap).find(([p]) =>
        location.pathname === p || location.pathname.startsWith(p + "/")
    )?.[1] ?? t("admin.sidebar.title");

    const handleLogout = () => {
        authService.logout();
        toast.success(t("admin.sidebar.logout_success"));
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-background flex text-slate-900 dark:text-slate-100 relative">

            {/* Mobile overlay */}
            <AnimatePresence>
                {isSidebarOpen && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar ── */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "circOut" }}
                        className="fixed inset-y-0 left-0 z-50 w-64 bg-[#003B5C] text-white shadow-2xl md:relative h-screen flex flex-col overflow-hidden"
                    >
                        {/* Fixed top */}
                        <div className="flex-shrink-0 px-5 pt-5 pb-2">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/img/logo2.png" alt="Logo" className="h-10 w-auto object-contain" />
                                <h1 className="font-display font-bold text-sm tracking-tight leading-tight">{t("admin.sidebar.title")}</h1>
                            </div>
                            <Link to="/"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all group text-sm mb-1"
                            >
                                <ArrowLeft size={15} className="group-hover:scale-110 transition-transform" />
                                <span className="font-body text-xs tracking-wide">Retour au site</span>
                            </Link>
                        </div>

                        {/* Scrollable nav — only this scrolls */}
                        <nav className="flex-1 overflow-y-auto min-h-0 px-4 pb-3 space-y-0.5">
                            <SidebarLink icon={LayoutDashboard} label={t("admin.sidebar.dashboard")} path="/admin/dashboard" />
                            <SidebarLink icon={Image}           label={t("admin.sidebar.media")}      path="/admin/media" />
                            <SidebarLink icon={Calendar}        label={t("admin.sidebar.programme")}  path="/admin/programme" />
                            <SidebarLink icon={Activity}        label={t("admin.sidebar.activities")} path="/admin/activities" />
                            <SidebarLink icon={Bell}            label={t("admin.sidebar.actualities")}path="/admin/actualities" />
                            <SidebarLink icon={Award}           label={t("admin.sidebar.sponsors")}   path="/admin/sponsors" />
                            <SidebarLink icon={MessageSquare}   label={t("admin.sidebar.messages")}   path="/admin/messages" />
                            <SidebarLink icon={Mail}            label={t("admin.sidebar.contacts")}   path="/admin/contacts" />
                            <SidebarLink icon={MapPin}          label="Sites"                          path="/admin/sites" />
                            <SidebarLink icon={Calendar}        label="Hôtels & Restaurants"            path="/admin/booking" />

                            <Divider />

                            <SidebarGroup
                                icon={Trophy}
                                label="Concours & Candidats"
                                matchPaths={["/admin/concours", "/admin/candidats", "/admin/vote-profiles"]}
                                isActive={location.pathname.startsWith("/admin/concours") || location.pathname.startsWith("/admin/candidats") || location.pathname.startsWith("/admin/vote-profiles")}
                            >
                                {[
                                    { icon: Medal,      label: "Concours",  path: "/admin/concours"  },
                                    { icon: ListChecks, label: "Candidats", path: "/admin/candidats" },
                                    { icon: Star,       label: "Votes",     path: "/admin/vote-profiles" },
                                ]}
                            </SidebarGroup>

                            <SidebarGroup
                                icon={ShoppingBag}
                                label="Boutique"
                                matchPaths={["/admin/shop"]}
                                isActive={location.pathname.startsWith("/admin/shop")}
                            >
                                {[
                                    { icon: ShoppingBag,   label: "Produits",   path: "/admin/shop/products"   },
                                    { icon: Tag,           label: "Catégories", path: "/admin/shop/categories" },
                                    { icon: ClipboardList, label: "Commandes",  path: "/admin/shop/orders"     },
                                ]}
                            </SidebarGroup>

                            <Divider />

                            <SidebarGroup
                                icon={UserCog}
                                label="Utilisateurs & Rôles"
                                matchPaths={["/admin/users", "/admin/roles"]}
                                isActive={location.pathname.startsWith("/admin/users") || location.pathname.startsWith("/admin/roles")}
                            >
                                {[
                                    { icon: Users,      label: t("admin.sidebar.users"), path: "/admin/users" },
                                    { icon: ShieldCheck,label: t("admin.sidebar.roles"), path: "/admin/roles" },
                                ]}
                            </SidebarGroup>
                        </nav>

                        {/* Fixed bottom — logout */}
                        <div className="flex-shrink-0 px-4 py-3 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                            >
                                <LogOut size={17} />
                                <span className="font-body text-sm font-medium">{t("admin.sidebar.logout")}</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Main content ── */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-[#002B44]/5 relative">
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(v => !v)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2 className="font-display font-bold text-lg md:text-xl text-slate-800 dark:text-white truncate max-w-[200px] md:max-w-none">
                            {pageTitle}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l md:border-slate-200 md:dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{username || t("admin.header.admin_label")}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{t("admin.header.super_admin")}</p>
                            </div>
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 overflow-hidden">
                                <UserCircle size={24} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Suspense fallback={<AdminContentSkeleton />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
