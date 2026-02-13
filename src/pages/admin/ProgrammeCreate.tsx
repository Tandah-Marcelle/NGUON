import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

const ProgrammeCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Mock data - replace with API call
    const programmes = [
        { id: 1, activity: "Cérémonie d'ouverture", location: "Place des Fêtes", date: "2026-12-04", startTime: "09:00", published: true },
        { id: 2, activity: "Spectacle de Danse", location: "Esplanade du Palais", date: "2026-12-05", startTime: "15:00", published: true },
        { id: 3, activity: "Foire Artisanale", location: "Village du Festival", date: "2026-12-06", startTime: "10:00", published: false },
    ];

    const [formData, setFormData] = useState({
        activity: "",
        location: "",
        date: "",
        startTime: "",
        published: false
    });

    useEffect(() => {
        if (isEditMode) {
            const programme = programmes.find(p => p.id === parseInt(id));
            if (programme) {
                setFormData({
                    activity: programme.activity,
                    location: programme.location,
                    date: programme.date,
                    startTime: programme.startTime,
                    published: programme.published
                });
            }
        }
    }, [id, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to create/update programme
        console.log(isEditMode ? "Updating programme:" : "Creating programme:", formData);
        navigate("/admin/programme");
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/programme")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? "Modifier l'Événement" : "Nouvel Événement"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? "Modifiez les informations de l'événement." : "Ajoutez une activité au programme."}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Activité
                        </label>
                        <input
                            type="text"
                            value={formData.activity}
                            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Lieu
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Heure de début
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Publier immédiatement
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/programme")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-6 bg-secondary text-primary rounded-2xl font-bold shadow-lg shadow-secondary/10 hover:scale-105 transition-transform"
                        >
                            {isEditMode ? "Mettre à jour" : "Créer l'événement"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgrammeCreate;
