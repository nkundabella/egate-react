import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/Card";
import { calculateTotal } from "@/utils/priceCalculator";
import {
    registrationSchema,
    type RegistrationFormData,
} from "@/utils/formValidation";
import { CopyPlus, Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/utils/api";

const MOCK_GATE_CODE = "123456";

const t = {
    English: {
        codeTitle: "Enter Gate Code",
        codeDesc:
            "Please enter the daily secure code to access the registration form.",
        codeLabel: "Secret Access Code",
        codePlaceholder: "Enter Code (hint: 123456)",
        verifyBtn: "Verify Code",
        formTitle: "Register Visit - e-gate",
        formDesc: "Please provide your valid ID and visitor count below.",
        visitorSection: "Visitor Details",
        studentSection: "Student Details",
        fullName: "Full name*",
        nationalId: "National ID*",
        phone: "Phone number*",
        numVisitors: "Number of visitors*",
        relationship: "Relationship to Student*",
        relationshipOptions: ["Parent", "Guardian", "Sibling", "Relative", "Other"],
        addStudent: "Add Student",
        studentLabel: (i: number) => `Student ${i + 1} Name`,
        totalPrice: "Total Price",
        paymentNote: "Payment instruction will be sent by confirmation email",
        privacy: "Privacy Policy",
        proceed: "Proceed to Checkout →",
        codeError: "Invalid gate code. Please try again.",
    },
    Français: {
        codeTitle: "Entrez le Code de Portail",
        codeDesc:
            "Veuillez entrer le code sécurisé du jour pour accéder au formulaire.",
        codeLabel: "Code d'Accès Secret",
        codePlaceholder: "Entrez le code (indice: 123456)",
        verifyBtn: "Vérifier le Code",
        formTitle: "Enregistrer la Visite - e-gate",
        formDesc:
            "Veuillez fournir votre pièce d'identité et le nombre de visiteurs.",
        visitorSection: "Détails du Visiteur",
        studentSection: "Détails de l'Élève",
        fullName: "Nom complet*",
        nationalId: "Carte d'Identité*",
        phone: "Numéro de Téléphone*",
        numVisitors: "Nombre de Visiteurs*",
        relationship: "Lien avec l'Élève*",
        relationshipOptions: ["Parent", "Tuteur", "Frère/Sœur", "Proche", "Autre"],
        addStudent: "Ajouter un Élève",
        studentLabel: (i: number) => `Nom de l'Élève ${i + 1}`,
        totalPrice: "Prix Total",
        paymentNote: "Les instructions de paiement seront envoyées par e-mail",
        privacy: "Politique de Confidentialité",
        proceed: "Procéder au Paiement →",
        codeError: "Code invalide. Veuillez réessayer.",
    },
    Kinyarwanda: {
        codeTitle: "Injiza Kode y'Irembo",
        codeDesc:
            "Injiza kode y'umutekano wa uyu munsi kugirango ubone uburenganzira.",
        codeLabel: "Kode Yibanga",
        codePlaceholder: "Injiza kode (urugero: 123456)",
        verifyBtn: "Emeza Kode",
        formTitle: "Iyandikisha - e-gate",
        formDesc: "Tanga indangamuntu yawe n'umubare w'abashyitsi.",
        visitorSection: "Amakuru y'Umushyitsi",
        studentSection: "Amakuru y'Umunyeshuri",
        fullName: "Amazina Yose*",
        nationalId: "Indangamuntu*",
        phone: "Nimero ya Telefone*",
        numVisitors: "Umubare w'Abashyitsi*",
        relationship: "Isano n'Umunyeshuri*",
        relationshipOptions: [
            "Umubyeyi",
            "Umurinzi",
            "Musaza/Mushiki",
            "Umuvandimwe",
            "Undi",
        ],
        addStudent: "Ongeraho Umunyeshuri",
        studentLabel: (i: number) => `Izina ry'Umunyeshuri ${i + 1}`,
        totalPrice: "Igiciro Cyose",
        paymentNote: "Amabwiriza y'ubwishyu azohererezwa kuri imeyili",
        privacy: "Amabwiriza y'Ibanga",
        proceed: "Komeza Kwishyura →",
        codeError: "Kode ntiboneye. Gerageza nanone.",
    },
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const tr = t[lang as keyof typeof t] ?? t.English;

    const [hasValidCode, setHasValidCode] = useState(false);
    const [gateCodeError, setGateCodeError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            parentName: "",
            nationalId: "",
            phoneNumber: "",
            relationship: "",
            relationshipOther: "",
            visitorCount: 1,
            studentNames: [""],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: control as never,
        name: "studentNames",
    });

    const visitorCount = watch("visitorCount") || 1;
    const relationship = watch("relationship");

    const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("gateCode") as string;

        if (code) {
            localStorage.setItem("e-gate_visit_code", code);
            setHasValidCode(true);
            setGateCodeError("");
        } else {
            setGateCodeError(tr.codeError);
        }
    };

    const onSubmit = async (data: RegistrationFormData) => {
        setIsRegistering(true);
        try {
            const visitCode = localStorage.getItem("e-gate_visit_code") || MOCK_GATE_CODE;

            const payload = {
                parentName: data.parentName,
                phone: data.phoneNumber,
                studentName: data.studentNames.join(", "),
                visitCode: visitCode,
            };

            const visitor = await api.registerVisitor(payload);

            if (data.visitorCount > 1) {
                const guests = [];
                for (let i = 1; i < data.visitorCount; i++) {
                    guests.push({ name: `Guest ${i}`, relationship: data.relationshipOther || data.relationship });
                }
                await api.addGuests(visitor.id, guests);
            }

            localStorage.setItem("e-gate_visitor_id", visitor.id);
            localStorage.setItem("e-gate_registration_data", JSON.stringify(data));
            navigate("/checkout");
        } catch (error: any) {
            alert(error.message || "Failed to register. Please check your details and try again.");
            setIsRegistering(false);
        }
    };

    if (!hasValidCode) {
        return (
            <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
                <Card className="w-full max-w-xs sm:max-w-sm p-6 sm:p-8">
                    <CardHeader className="px-0 pt-0 text-center pb-4">
                        <CardTitle className="text-xl sm:text-3xl pb-2">
                            {tr.codeTitle}
                        </CardTitle>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            {tr.codeDesc}
                        </p>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <form
                            onSubmit={handleCodeSubmit}
                            className="space-y-5 sm:space-y-6"
                        >
                            <Input
                                name="gateCode"
                                label={tr.codeLabel}
                                placeholder={tr.codePlaceholder}
                                type="password"
                                error={gateCodeError}
                                autoFocus
                            />
                            <Button type="submit" className="w-full" size="lg">
                                {tr.verifyBtn}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 py-16 sm:py-12">
            <Card className="w-full max-w-2xl overflow-hidden pt-5 sm:pt-8">
                <CardHeader className="px-4 sm:px-8 pt-0 space-y-1 sm:space-y-2">
                    <CardTitle className="text-lg sm:text-2xl">{tr.formTitle}</CardTitle>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        {tr.formDesc}
                    </p>
                </CardHeader>

                <CardContent className="px-4 sm:px-8 py-4 sm:py-6">
                    <form
                        id="visitor-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5 sm:space-y-8"
                    >
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                {tr.visitorSection}
                            </h4>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label={tr.fullName}
                                    placeholder="John Doe"
                                    {...register("parentName")}
                                    error={errors.parentName?.message}
                                />
                                <Input
                                    label={tr.nationalId}
                                    placeholder="16 digits"
                                    maxLength={16}
                                    {...register("nationalId")}
                                    error={errors.nationalId?.message}
                                />
                                <Input
                                    label={tr.phone}
                                    type="tel"
                                    placeholder="078..."
                                    {...register("phoneNumber")}
                                    error={errors.phoneNumber?.message}
                                />
                                <Input
                                    label={tr.numVisitors}
                                    type="number"
                                    min={1}
                                    max={10}
                                    {...register("visitorCount", { valueAsNumber: true })}
                                    error={errors.visitorCount?.message}
                                />
                                {/* Relationship select — full width */}
                                <div className="sm:col-span-2 flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">
                                        {tr.relationship}
                                    </label>
                                    <select
                                        {...register("relationship")}
                                        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                    >
                                        <option value="">— Select —</option>
                                        {tr.relationshipOptions.map((opt: string) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.relationship && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.relationship.message}
                                        </p>
                                    )}
                                </div>
                                {/* Custom input when 'Other' / 'Autre' / 'Undi' is selected — uses its own field so typing doesn't close the input */}
                                {["Other", "Autre", "Undi"].includes(relationship) && (
                                    <div className="sm:col-span-2">
                                        <Input
                                            label={
                                                lang === "Français"
                                                    ? "Précisez la relation"
                                                    : lang === "Kinyarwanda"
                                                        ? "Sobanura isano"
                                                        : "Please specify your relationship"
                                            }
                                            placeholder={
                                                lang === "Français"
                                                    ? "ex. Oncle, tuteur..."
                                                    : lang === "Kinyarwanda"
                                                        ? "urugero: Nyirarume..."
                                                        : "e.g. Uncle, tutor..."
                                            }
                                            {...register("relationshipOther")}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-b border-border" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                    {tr.studentSection}
                                </h4>
                                {visitorCount > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append("")}
                                        className="h-9 px-3 rounded-2xl"
                                    >
                                        <CopyPlus className="mr-2 h-4 w-4" />
                                        {tr.addStudent}
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Always render at least 1 student field */}
                                {(fields.length === 0 ? [{ id: "default-0" }] : fields).map(
                                    (field: any, index: number) => (
                                        <div key={field.id} className="flex items-start space-x-2">
                                            <div className="flex-1">
                                                <Input
                                                    label={tr.studentLabel(index)}
                                                    placeholder="Jane Doe"
                                                    {...register(`studentNames.${index}` as const)}
                                                    error={errors.studentNames?.[index]?.message}
                                                />
                                            </div>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="mt-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>

                {/* Sticky Footer matching reference */}
                <div className="bg-card border-t border-border px-4 sm:px-8 py-5 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                    <div>
                        <p className="text-xl font-bold text-[#153d5d] dark:text-white">
                            {tr.totalPrice}: {calculateTotal(Number(visitorCount) || 0)} RWF
                        </p>
                        <p className="text-sm text-[#153d5d] dark:text-white mt-1 font-medium">
                            {tr.paymentNote}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
                            By clicking the button you agree to our{" "}
                            <a href="#" className="underline">
                                {tr.privacy}
                            </a>
                        </p>
                    </div>

                    <Button
                        form="visitor-form"
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto mt-6 sm:mt-0 min-w-[200px]"
                        disabled={!isValid || isRegistering}
                    >
                        {isRegistering ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                        ) : tr.proceed}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
