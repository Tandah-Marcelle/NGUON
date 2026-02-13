import { Loader2 } from "lucide-react";

const PageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#002B44]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-body animate-pulse">Chargement...</p>
            </div>
        </div>
    );
};

export default PageLoader;
