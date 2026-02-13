import { motion } from "framer-motion";

const ShimmerLoader = () => {
    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Nav Shimmer */}
            <div className="h-20 w-full px-8 flex items-center justify-between border-b border-border/50">
                <div className="h-10 w-32 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg" />
                <div className="hidden lg:flex gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-4 w-20 bg-slate-200 dark:bg-white/5 animate-pulse rounded" />
                    ))}
                </div>
                <div className="flex gap-4">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg" />
                    <div className="h-10 w-10 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg" />
                </div>
            </div>

            {/* Hero Shimmer */}
            <div className="container mx-auto px-8 pt-20">
                <div className="max-w-4xl space-y-8">
                    <div className="space-y-4">
                        <div className="h-16 w-3/4 bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl" />
                        <div className="h-16 w-1/2 bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-slate-200 dark:bg-white/5 animate-pulse rounded" />
                        <div className="h-4 w-11/12 bg-slate-200 dark:bg-white/5 animate-pulse rounded" />
                        <div className="h-4 w-4/5 bg-slate-200 dark:bg-white/5 animate-pulse rounded" />
                    </div>
                    <div className="flex gap-4 pt-10">
                        <div className="h-14 w-48 bg-slate-200 dark:bg-white/5 animate-pulse rounded-xl" />
                        <div className="h-14 w-48 bg-slate-200 dark:bg-white/5 animate-pulse rounded-xl" />
                    </div>
                </div>

                {/* Section Shimmer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-6">
                            <div className="aspect-video w-full bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl" />
                            <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-slate-200 dark:bg-white/5 animate-pulse rounded" />
                                <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/5 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Branding/Logo Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10" />
                    </motion.div>
                    <p className="text-center mt-4 text-primary font-bold tracking-widest text-xs uppercase animate-pulse">
                        {/* Empty text placeholder or just dots */}
                        ...
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ShimmerLoader;
