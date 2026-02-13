import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, User, Calendar, CheckCircle2 } from "lucide-react";

const ContactView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data - replace with API call
    const contacts = [
        { id: 1, name: "Jean Dupont", email: "jean@example.com", message: "Bonjour, je souhaite avoir plus d'informations sur le festival...", responded: false, createdAt: "2026-02-10" },
        { id: 2, name: "Marie Kamga", email: "marie@example.com", message: "Comment puis-je participer aux activités culturelles?", responded: true, createdAt: "2026-02-11" },
        { id: 3, name: "Paul Nkeng", email: "paul@example.com", message: "Quels sont les horaires d'ouverture du festival?", responded: false, createdAt: "2026-02-12" },
    ];

    const [contact, setContact] = useState<any>(null);

    useEffect(() => {
        const foundContact = contacts.find(c => c.id === parseInt(id || "0"));
        setContact(foundContact);
    }, [id]);

    const handleMarkAsResponded = () => {
        // TODO: Implement API call to mark as responded
        console.log("Marking as responded:", id);
        navigate("/admin/contacts");
    };

    if (!contact) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/contacts")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        Détails du Message
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        Message reçu le {contact.createdAt}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <User size={20} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Nom</p>
                                <p className="text-lg font-semibold text-slate-800 dark:text-white">{contact.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Email</p>
                                <p className="text-lg text-slate-800 dark:text-white">{contact.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Date</p>
                                <p className="text-lg text-slate-800 dark:text-white">{contact.createdAt}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        {contact.responded ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-bold">
                                <CheckCircle2 size={16} /> Répondu
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full text-sm font-bold">
                                En attente
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Message</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{contact.message}</p>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        onClick={() => navigate("/admin/contacts")}
                        className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                        Retour
                    </button>
                    {!contact.responded && (
                        <button
                            onClick={handleMarkAsResponded}
                            className="flex-1 py-3 px-6 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:scale-105 transition-transform"
                        >
                            Marquer comme répondu
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactView;
