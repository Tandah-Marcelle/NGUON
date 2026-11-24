import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import palace from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";
import { NdopTexture, WovenBand, GOLD } from "@/components/heritage/Motif";

const Login = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.login({ username, password });
            toast.success(t('admin.login.success'));
            navigate("/admin/dashboard");
        } catch (error) {
            toast.error(t('admin.login.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy lg:grid lg:grid-cols-[1.1fr_1fr]">
            {/* Palace photo panel */}
            <div className="relative hidden lg:block overflow-hidden">
                <img src={palace} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
                <div className="absolute inset-x-0 bottom-0 p-12">
                    <p className="font-display text-3xl font-black leading-tight text-white text-balance max-w-md">Le Nguon — Patrimoine culturel du Royaume Bamoun</p>
                    <WovenBand color={GOLD} opacity={0.8} className="mt-6 max-w-xs" />
                </div>
            </div>

            <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
            <NdopTexture opacity={0.06} fade="edges" />
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="rounded-[2rem] border border-white/10 bg-navy-deep/70 p-8 md:p-12 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto mb-6 flex items-center justify-center"
                        >
                            <img
                                src="/img/logo1.png"
                                alt="Le Nguon Logo"
                                className="h-24 w-auto drop-shadow-lg"
                            />
                        </motion.div>
                        <h1 className="font-display text-3xl font-bold text-white mb-2">{t('admin.login.title')}</h1>
                        <p className="text-white/60 font-body text-sm">{t('admin.login.subtitle')}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-white/80 text-sm font-semibold ml-1">{t('admin.login.username_label')}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-secondary transition-colors z-10">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t('admin.login.email_placeholder')}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all font-body"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-white/80 text-sm font-semibold ml-1">{t('admin.login.password_label')}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-secondary transition-colors z-10">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('admin.login.password_placeholder')}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all font-body"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-secondary/80 transition-colors z-10"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className="w-full bg-secondary text-primary font-display font-bold text-lg py-4 rounded-2xl shadow-xl shadow-secondary/10 flex items-center justify-center gap-3 transition-all relative overflow-hidden group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-4 border-dashed border-primary/30 border-t-primary rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{t('admin.login.button')}</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Footer info */}
                    <p className="mt-8 text-center text-white/40 text-xs font-body tracking-wider">
                        {t('admin.login.footer')}
                    </p>
                </div>
            </motion.div>
            </div>
        </div>
    );
};

export default Login;
