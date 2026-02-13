import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ContactView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [contact, setContact] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadContact();
    }, [id]);

    const loadContact = async () => {
        try {
            const data = await api.getContactById(Number(id));
            setContact(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger le contact", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async () => {
        if (!responseMessage.trim()) {
            toast({ title: "Erreur", description: "Veuillez saisir un message", variant: "destructive" });
            return;
        }

        setSending(true);
        try {
            await api.respondToContact(Number(id), responseMessage);
            toast({ title: "Succès", description: "Réponse envoyée par email" });
            setResponseMessage("");
            loadContact();
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible d'envoyer la réponse", variant: "destructive" });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    if (!contact) {
        return <div>Contact non trouvé</div>;
    }

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate("/admin/contacts")}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Retour aux contacts</span>
            </button>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-6">Détails du Contact</h1>

                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nom</label>
                        <p className="text-lg text-slate-800 dark:text-white mt-1">{contact.name}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email</label>
                        <p className="text-lg text-slate-800 dark:text-white mt-1">{contact.email}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date</label>
                        <p className="text-lg text-slate-800 dark:text-white mt-1">{contact.createdAt}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Message</label>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap">{contact.message}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Statut</label>
                        <p className="mt-2">
                            {contact.responded ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
                                    Répondu
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-bold">
                                    En attente
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-6">Répondre</h2>
                
                <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Saisissez votre réponse..."
                    rows={6}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />

                <button
                    onClick={handleRespond}
                    disabled={sending}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                    {sending ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Envoi...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Envoyer la réponse
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ContactView;
