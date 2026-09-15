import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Camera,
    Smartphone,
    FileCheck2,
    HeartHandshake,
    Sparkles,
    Lock,
    Users,
    CheckCircle2,
    MapPin
} from "lucide-react";

const requirements = [
    {
        title: "Identificación Oficial (KYC)",
        description: "Documento oficial vigente para verificar mayoría de edad (+18) y autenticidad real de identidad.",
        icon: ShieldCheck,
    },
    {
        title: "Selfie con Prueba de Vida (Liveness)",
        description: "Tecnología biométrica anti-suplantación para garantizar que cada perfil pertenezca a una persona 100% real.",
        icon: Camera,
    },
    {
        title: "Teléfono y Email Verificado (OTP)",
        description: "Verificación en dos pasos para proteger tu cuenta y evitar perfiles duplicados o spam.",
        icon: Smartphone,
    },
    {
        title: "Cuestionario de Compatibilidad",
        description: "Respuestas honestas sobre fe LDS, visión de matrimonio, valores familiares, estilo de vida e intereses.",
        icon: FileCheck2,
    },
    {
        title: "Fotografías Auténticas",
        description: "Fotos recientes y claras moderadas por IA para mantener un entorno seguro, limpio y confiable.",
        icon: Sparkles,
    },
    {
        title: "Filtros Indispensables Definidos",
        description: "Configuración clara de tus requisitos fundamentales y preferencias para el motor de compatibilidad 0-100%.",
        icon: Lock,
    },
    {
        title: "Protocolo Safe First Date",
        description: "Compromiso con citas en lugares públicos, horarios diurnos y sistema de check-in de seguridad.",
        icon: MapPin,
    },
    {
        title: "Comunidad Basada en el Respeto",
        description: "Aceptación de las normas de conducta y políticas de tolerancia cero ante acoso o información engañosa.",
        icon: HeartHandshake,
    },
    {
        title: "Geolocalización Aproximada",
        description: "Ubicación por ciudad o código postal en Utah sin exponer jamás tu dirección o GPS exacto.",
        icon: Users,
    },
    {
        title: "Insignia de Perfil Verificado",
        description: "Distintivo oficial que acredita que tu perfil cumple con todos los estándares de seguridad de KLICK!.",
        icon: CheckCircle2,
    }
];

export default function ProfileRequirements() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const maxScrollLeft = scrollWidth - clientWidth;
            const progress = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0;
            setScrollProgress(progress);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const maxScrollLeft = scrollWidth - clientWidth;
            const scrollLeft = (value / 100) * maxScrollLeft;
            scrollRef.current.scrollLeft = scrollLeft;
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
            handleScroll();
            return () => currentRef.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <section className="py-24 bg-white overflow-hidden" id="requisitos-verificacion">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <span className="text-pink-600 font-bold tracking-wider text-xs uppercase bg-pink-50 px-3.5 py-1.5 rounded-full border border-pink-100">
                            Estándares de Seguridad
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
                            Requisitos de <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-[#9b4dca]">Verificación KLICK!</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-2xl mt-4 text-base">
                            Para proteger a nuestra comunidad en Utah, cada miembro pasa por un proceso de verificación de identidad y compatibilidad antes de conectar.
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={scrollProgress}
                            onChange={handleSliderChange}
                            aria-label="Progreso de requisitos"
                            className="w-32 md:w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                        />
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {requirements.map((req, idx) => {
                        const Icon = req.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="min-w-[280px] md:min-w-[340px] max-w-[340px] bg-slate-50 hover:bg-white border border-slate-100 hover:border-pink-200 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-pink-500/5 snap-start flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-pink-50 border border-slate-100 group-hover:border-pink-100 flex items-center justify-center text-pink-600 transition-colors mb-6 shadow-sm">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {req.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-normal">
                                        {req.description}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-semibold">
                                    <span>Paso {idx + 1} de {requirements.length}</span>
                                    <span className="text-pink-600 group-hover:translate-x-1 transition-transform">Requisito Oficial →</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
