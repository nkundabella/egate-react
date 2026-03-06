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
import { Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const t = {
    English: {
        titlePending: "Payment Submitted — Awaiting Verification",
        descPending: "Your registration is complete. Once an admin verifies your MoMo payment, you will receive a confirmation SMS with your entry code.",
        titleConfirmed: "Confirmed!",
        descConfirmed: "Your visit has been registered and payment confirmed.",
        visiting: "is coming to visit",
        with: "with",
        otherVisitor: "other visitor",
        otherVisitors: "other visitors",
        amount: "Amount Due",
        smsNote: "📱 You will receive an SMS on",
        smsNote2: "once your payment is verified by the admin.",
        done: "Done",
    },
    Français: {
        titlePending: "Paiement Soumis — En attente de vérification",
        descPending: "Votre inscription est complète. Dès qu'un administrateur vérifie votre paiement MoMo, vous recevrez un SMS de confirmation avec votre code d'entrée.",
        titleConfirmed: "Confirmé !",
        descConfirmed: "Votre visite a été enregistrée et le paiement confirmé.",
        visiting: "vient rendre visite à",
        with: "avec",
        otherVisitor: "autre visiteur",
        otherVisitors: "autres visiteurs",
        amount: "Montant Dû",
        smsNote: "📱 Vous recevrez un SMS au",
        smsNote2: "une fois votre paiement vérifié par l'administrateur.",
        done: "Terminer",
    },
    Kinyarwanda: {
        titlePending: "Ubutumwa bw'Ubwishyu Bwakiriwe — Birategerejwe",
        descPending: "Kwiyandikisha kwasoje. Nyuma yo gusuzumwa n'umuyobozi, uzahabwa ubutumwa kuri telefone yawe n'ikode yo kwinjira.",
        titleConfirmed: "Byemejwe!",
        descConfirmed: "Inzira yawe yandikishijwe kandi ubwishyu bwemejwe.",
        visiting: "azasura",
        with: "hamwe na",
        otherVisitor: "undi mushyitsi",
        otherVisitors: "abandi bashyitsi",
        amount: "Amafaranga Yishyurwa",
        smsNote: "📱 Uzahabwa ubutumwa kuri",
        smsNote2: "nyuma yo gusuzumwa n'umuyobozi.",
        done: "Rangiza",
    },
};

export default function ConfirmationPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<RegistrationFormData | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(true);
    const { lang } = useLanguage();
    const tr = t[lang as keyof typeof t] ?? t.English;

    useEffect(() => {
        const status = localStorage.getItem("e-gate_payment_status");
        const storedData = localStorage.getItem("e-gate_registration_data");
        const qr = localStorage.getItem("e-gate_qr_code");

        if (!status || !storedData) {
            navigate("/");
            return;
        }

        setData(JSON.parse(storedData));
        setQrCode(qr);
        setIsPending(status === "pending");
    }, [navigate]);

    if (!data) return null;

    const totalAmount = calculateTotal(data.visitorCount);
    const otherVisitors = data.visitorCount - 1;

    const handleDone = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-3 sm:p-4 md:p-8 py-14 sm:py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="border-border shadow-lg overflow-hidden relative">
                    <div className={`absolute top-0 left-0 right-0 h-4 ${isPending ? "bg-yellow-500" : "bg-green-500"}`} />
                    <CardHeader className="text-center pt-8 pb-4 space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isPending ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}
                        >
                            {isPending ? <Clock size={32} /> : <CheckCircle2 size={32} />}
                        </motion.div>
                        <CardTitle className="text-xl sm:text-2xl">
                            {isPending ? tr.titlePending : tr.titleConfirmed}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {isPending ? tr.descPending : tr.descConfirmed}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Summary */}
                        <div className="rounded-lg bg-secondary/50 p-5 text-center text-sm leading-relaxed border border-border/50">
                            <span className="font-semibold text-foreground">{data.parentName}</span>{" "}
                            {tr.visiting}{" "}
                            <span className="font-semibold text-foreground">
                                {data.studentNames.join(" and ")}
                            </span>
                            {otherVisitors > 0 && (
                                <>
                                    {" "}{tr.with}{" "}
                                    <span className="font-semibold text-foreground">
                                        {otherVisitors}{" "}
                                        {otherVisitors > 1 ? tr.otherVisitors : tr.otherVisitor}
                                    </span>
                                </>
                            )}.
                        </div>

                        {/* Amount */}
                        <div className="flex justify-between items-center rounded-lg bg-secondary/30 px-5 py-3 border border-border/50">
                            <span className="text-sm text-muted-foreground">{tr.amount}</span>
                            <span className="font-bold text-primary text-xl">{totalAmount} RWF</span>
                        </div>

                        {/* SMS notice when pending */}
                        {isPending && (
                            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3 text-sm text-blue-700 dark:text-blue-400 text-center leading-relaxed">
                                {tr.smsNote}{" "}
                                <span className="font-semibold">{data.phoneNumber}</span>{" "}
                                {tr.smsNote2}
                            </div>
                        )}

                        {/* QR code once admin has confirmed */}
                        {qrCode && (
                            <div className="flex flex-col items-center justify-center mt-4">
                                <p className="text-sm font-semibold mb-2 text-muted-foreground">
                                    {lang === "Français" ? "Votre QR Code d'entrée" : lang === "Kinyarwanda" ? "QR Code Yawe yo Kwinjira" : "Your Entry QR Code"}
                                </p>
                                <img
                                    src={qrCode}
                                    alt="Entry QR Code"
                                    className="w-48 h-48 rounded-md shadow-sm border border-border/50"
                                />
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col space-y-3 pt-2">
                        <Button className="w-full" size="lg" onClick={handleDone}>
                            {tr.done}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
