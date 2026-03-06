import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationFormData } from "@/utils/formValidation";
import { calculateTotal } from "@/utils/priceCalculator";
import { Button } from "@/components/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/Card";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/utils/api";
import { Phone, Copy, CheckCircle2 } from "lucide-react";

const SCHOOL_MOMO_NUMBER = "0792631246";
const SCHOOL_MOMO_NAME = "Isabella Nkunda";

const t = {
    English: {
        title: "Pay via Mobile Money",
        desc: "Send the exact amount to the number below using your preferred Mobile Money service.",
        sendTo: "Send to",
        amount: "Amount to Send",
        copy: "Copy Number",
        copied: "Copied!",
        openPhone: "Open Phone App",
        confirm: "I've Completed the Payment",
        processing: "Submitting…",
        warning: "⚠️ Do not close this page until you tap the button below.",
        cancel: "Cancel",
    },
    Français: {
        title: "Payer via Mobile Money",
        desc: "Envoyez le montant exact au numéro ci-dessous via votre service Mobile Money.",
        sendTo: "Envoyer à",
        amount: "Montant à Envoyer",
        copy: "Copier le numéro",
        copied: "Copié !",
        openPhone: "Ouvrir l'App Téléphone",
        confirm: "J'ai effectué le paiement",
        processing: "Envoi en cours…",
        warning: "⚠️ Ne fermez pas cette page avant d'appuyer sur le bouton ci-dessous.",
        cancel: "Annuler",
    },
    Kinyarwanda: {
        title: "Ishyura ukoresheje Mobile Money",
        desc: "Ohereza amafaranga nayo ku nimero iri hasi ukoresheje serivisi ya Mobile Money uhitamo.",
        sendTo: "Ohereza kuri",
        amount: "Amafaranga Wohereza",
        copy: "Kopa Nimero",
        copied: "Yakopowe!",
        openPhone: "Fungura Porogaramu ya Telefone",
        confirm: "Nohereje Amafaranga",
        processing: "Birashyirwa…",
        warning: "⚠️ Ntugomba gufunga urupapuro mbere yo gukanda buto iri hasi.",
        cancel: "Hagarika",
    },
};

export default function PaymentPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<RegistrationFormData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [numberCopied, setNumberCopied] = useState(false);
    const { lang } = useLanguage();
    const tr = t[lang as keyof typeof t] ?? t.English;

    useEffect(() => {
        const storedData = localStorage.getItem("e-gate_registration_data");
        const storedMethod = localStorage.getItem("e-gate_payment_method");
        if (!storedData || !storedMethod) {
            navigate("/register");
            return;
        }
        setData(JSON.parse(storedData));
    }, [navigate]);

    if (!data) return null;

    const totalAmount = calculateTotal(data.visitorCount);

    const copyNumber = async () => {
        await navigator.clipboard.writeText(SCHOOL_MOMO_NUMBER);
        setNumberCopied(true);
        setTimeout(() => setNumberCopied(false), 2500);
    };

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const visitorId = localStorage.getItem("e-gate_visitor_id");
            if (!visitorId) {
                throw new Error("Missing visitor ID. Please restart the registration process.");
            }
            await api.processPayment(visitorId, { network: "MTN", phoneNumber: data.phoneNumber });
            localStorage.setItem("e-gate_payment_status", "pending");
            navigate("/confirmation");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-3 sm:p-4 md:p-8 py-14 sm:py-12">
            <Card className="w-full max-w-md border-border shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Phone className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-xl sm:text-2xl">{tr.title}</CardTitle>
                    </div>
                    <CardDescription>{tr.desc}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* MoMo number card */}
                    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {tr.sendTo}
                        </p>
                        {/* Big copyable number */}
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="font-mono font-bold text-3xl text-foreground tracking-widest">
                                    {SCHOOL_MOMO_NUMBER}
                                </p>
                                <p className="text-sm text-muted-foreground mt-0.5">{SCHOOL_MOMO_NAME}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={copyNumber} className="shrink-0 gap-2">
                                {numberCopied
                                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    : <Copy className="h-4 w-4" />}
                                {numberCopied ? tr.copied : tr.copy}
                            </Button>
                        </div>

                        {/* Amount */}
                        <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{tr.amount}</span>
                            <span className="font-bold text-2xl text-primary">
                                {totalAmount} <span className="text-base font-semibold">RWF</span>
                            </span>
                        </div>
                    </div>

                    {/* Open phone dialer button */}
                    <a href={`tel:${SCHOOL_MOMO_NUMBER}`} className="block">
                        <Button variant="outline" className="w-full gap-2" size="lg">
                            <Phone className="h-4 w-4" />
                            {tr.openPhone}
                        </Button>
                    </a>

                    {/* Warning */}
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 text-center px-2">
                        {tr.warning}
                    </p>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleConfirm}
                        isLoading={isProcessing}
                        disabled={isProcessing}
                    >
                        {isProcessing ? tr.processing : tr.confirm}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => navigate(-1)}
                        disabled={isProcessing}
                    >
                        {tr.cancel}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
