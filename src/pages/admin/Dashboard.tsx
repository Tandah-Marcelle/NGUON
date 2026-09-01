import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Users,
    Image as ImageIcon,
    ShoppingBag,
    Star,
    Clock,
    Mail,
    Newspaper,
    Loader2,
    UserCog,
    CalendarPlus,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";

type ActivityItem = { icon: typeof Mail; title: string; subtitle: string; date: Date };

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: "admin.dashboard.stats.candidats", value: "—", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "admin.dashboard.stats.media", value: "—", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "admin.dashboard.stats.orders", value: "—", icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "admin.dashboard.stats.votes", value: "—", icon: Star, color: "text-green-500", bg: "bg-green-500/10" },
    ]);
    const [activity, setActivity] = useState<ActivityItem[]>([]);

    useEffect(() => {
        Promise.all([
            api.getCandidats().catch(() => []),
            api.getMediaItems().catch(() => []),
            api.getShopOrders().catch(() => []),
            api.getVoteProfilesAdmin().catch(() => []),
            api.getContacts().catch(() => []),
            api.getActualities().catch(() => []),
        ]).then(([candidats, media, orders, voteProfiles, contacts, actualities]) => {
            const totalVotes = voteProfiles.reduce((sum: number, p: any) => sum + (p.voteCount ?? 0), 0);

            setStats([
                { label: "admin.dashboard.stats.candidats", value: String(candidats.length), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "admin.dashboard.stats.media", value: String(media.length), icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "admin.dashboard.stats.orders", value: String(orders.length), icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10" },
                { label: "admin.dashboard.stats.votes", value: String(totalVotes), icon: Star, color: "text-green-500", bg: "bg-green-500/10" },
            ]);

            const recentContacts: ActivityItem[] = contacts.slice(0, 5).map((c: any) => ({
                icon: Mail, title: t("admin.dashboard.recent_activity.new_contact", { name: c.name }),
                subtitle: c.message?.slice(0, 80) ?? "", date: new Date(c.createdAt),
            }));
            const recentOrders: ActivityItem[] = orders.slice(0, 5).map((o: any) => ({
                icon: ShoppingBag, title: t("admin.dashboard.recent_activity.new_order", { id: o.id }),
                subtitle: `${o.clientName} — ${Number(o.total).toLocaleString("fr-FR")} FCFA`, date: new Date(o.createdAt),
            }));
            const recentActualities: ActivityItem[] = actualities.slice(0, 5).map((a: any) => ({
                icon: Newspaper, title: t("admin.dashboard.recent_activity.new_actuality"),
                subtitle: a.title, date: new Date(a.createdAt),
            }));

            const merged = [...recentContacts, ...recentOrders, ...recentActualities]
                .filter(item => !isNaN(item.date.getTime()))
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 6);
            setActivity(merged);
        }).finally(() => setLoading(false));
    }, [t]);

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">{t('admin.dashboard.welcome')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">{t('admin.dashboard.overview')}</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-body px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm">
                    <Clock size={16} className="text-primary" />
                    <span className="text-slate-600 dark:text-slate-300">{new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <AnimatedSection key={stat.label} delay={i * 0.1}>
                        <div className="bg-white dark:bg-card p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/5 hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t(stat.label)}</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                                {loading ? <Loader2 size={20} className="animate-spin text-slate-300" /> : stat.value}
                            </h3>
                        </div>
                    </AnimatedSection>
                ))}
            </div>

            {/* Main Grid Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {t('admin.dashboard.recent_activity.title')}
                    </h2>
                    <div className="bg-white dark:bg-card rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-white/5 space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 size={22} className="animate-spin text-slate-300" />
                            </div>
                        ) : activity.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">{t('admin.dashboard.recent_activity.empty')}</p>
                        ) : (
                            activity.map((item, i) => (
                                <motion.div
                                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="text-slate-400" size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium truncate">{item.title}</p>
                                        {item.subtitle && <p className="text-xs text-slate-500 mt-1 truncate">{item.subtitle}</p>}
                                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tighter">
                                            <Clock size={10} /> {item.date.toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                        {t('admin.dashboard.quick_actions.title')}
                    </h2>
                    <div className="grid gap-4">
                        <button onClick={() => navigate("/admin/media")} className="flex items-center gap-4 p-4 bg-primary text-white rounded-2xl hover:opacity-90 transition-all font-body text-sm font-bold shadow-lg shadow-primary/20">
                            <ImageIcon size={20} />
                            {t('admin.dashboard.quick_actions.add_media')}
                        </button>
                        <button onClick={() => navigate("/admin/activities")} className="flex items-center gap-4 p-4 bg-secondary text-primary rounded-2xl hover:opacity-90 transition-all font-body text-sm font-bold shadow-lg shadow-secondary/10">
                            <CalendarPlus size={20} />
                            {t('admin.dashboard.quick_actions.new_event')}
                        </button>
                        <button onClick={() => navigate("/admin/users")} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-body text-sm font-bold shadow-sm">
                            <UserCog size={20} />
                            {t('admin.dashboard.quick_actions.manage_access')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
