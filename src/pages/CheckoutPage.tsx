import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegistrationFormData } from "@/utils/formValidation";
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
import { Smartphone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const t = {
    English: {
        title: "Checkout Summary",
        desc: "Review your visit details before proceeding to payment.",
        parentName: "Parent Name",
        phone: "Phone Number",
        students: "Visiting Students",
        visitors: "Number of Visitors",
        totalPrice: "Total Price",
        paymentMethod: "Payment Method",
        momoTitle: "Mobile Money (MTN / Airtel)",
        momoDesc: "You will be shown the school's MoMo number to send the exact amount.",
        proceed: "Proceed to Payment",
    },
    Français: {
        title: "Résumé du paiement",
        desc: "Vérifiez vos informations avant de procéder au paiement.",
        parentName: "Nom du Parent",
        phone: "Numéro de Téléphone",
        students: "Élèves Visités",
        visitors: "Nombre de Visiteurs",
        totalPrice: "Prix Total",
        paymentMethod: "Mode de Paiement",
        momoTitle: "Mobile Money (MTN / Airtel)",
        momoDesc: "Le numéro MoMo de l'école vous sera affiché pour envoyer le montant exact.",
        proceed: "Procéder au Paiement",
    },
    Kinyarwanda: {
        title: "Incamake y'Ubwishyu",
        desc: "Suzuma amakuru yawe mbere yo kwishyura.",
        parentName: "Izina ry'Umubyeyi",
        phone: "Nimero ya Telefone",
        students: "Abanyeshuri ba Guest",
        visitors: "Umubare w'Abashyitsi",
        totalPrice: "Igiciro Cyose",
        paymentMethod: "Uburyo bwo Kwishyura",
        momoTitle: "Mobile Money (MTN / Airtel)",
        momoDesc: "Uzabona nimero ya MoMo y'ishuri kugira ngo wohereze amafaranga.",
        proceed: "Komeza Kwishyura",
    },
};

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<RegistrationFormData | null>(null);
    const { lang } = useLanguage();
    const tr = t[lang as keyof typeof t] ?? t.English;

    useEffect(() => {
        const stored = localStorage.getItem("e-gate_registration_data");
        if (!stored) {
            navigate("/register");
            return;
        }
        setData(JSON.parse(stored));
    }, [navigate]);

    if (!data) return null;

    const totalAmount = calculateTotal(data.visitorCount);

    const handleProceed = () => {
        localStorage.setItem("e-gate_payment_method", "momo");
        navigate("/payment");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-3 sm:p-4 md:p-8 py-14 sm:py-12">
            <Card className="w-full max-w-lg border-border shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">{tr.title}</CardTitle>
                    <CardDescription>{tr.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Summary */}
                    <div className="rounded-lg bg-secondary/30 p-4 space-y-3">
                        <div className="flex justify-between border-b border-border pb-2 text-sm">
                            <span className="text-muted-foreground mr-4">{tr.parentName}</span>
                            <span className="font-medium text-right">{data.parentName}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2 text-sm">
                            <span className="text-muted-foreground mr-4">{tr.phone}</span>
                            <span className="font-medium text-right">{data.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2 text-sm">
                            <span className="text-muted-foreground mr-4">{tr.students}</span>
                            <span className="font-medium text-right">
                                {data.studentNames.join(", ")}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2 text-sm">
                            <span className="text-muted-foreground mr-4">{tr.visitors}</span>
                            <span className="font-medium text-right">{data.visitorCount}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-semibold text-foreground">{tr.totalPrice}</span>
                            <span className="font-bold text-primary text-xl">{totalAmount} RWF</span>
                        </div>
                    </div>

                    {/* MoMo-only payment option (display only, not selectable) */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {tr.paymentMethod}
                        </h4>
                        <div className="flex items-start gap-4 rounded-xl border-2 border-primary bg-primary/5 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{tr.momoTitle}</p>
                                <p className="text-sm text-muted-foreground">{tr.momoDesc}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handleProceed}>
                        {tr.proceed}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
