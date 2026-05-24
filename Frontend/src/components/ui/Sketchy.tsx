"use client";

import React, { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Circle, Layout, PenTool, Ruler, Scissors, Shapes, Star, User, Zap, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroBg from "@/assets/hero.png";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// --- 1. The Magic SVG Filter (Squiggly Lines) ---
export function SquiggleFilter() {
    return (
        <svg className="hidden">
            <defs>
                <filter id="squiggle">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="5" result="noise" seed="0" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
                <filter id="pencil-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </defs>
        </svg>
    );
}

// --- 2. Hand-Drawn Components ---

export function SketchButton({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95, rotate: 1 }}
            className={cn(
                "relative px-8 py-3 font-bold text-slate-800 transition-colors group",
                className
            )}
        >
            <div className="absolute inset-0 h-full w-full" style={{ filter: "url(#squiggle)" }}>
                <svg className="h-full w-full overflow-visible">
                    <rect x="2" y="2" width="100%" height="100%" rx="8" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-slate-800" />
                </svg>
            </div>
            <div className="absolute inset-0 top-1 left-1 -z-10 h-full w-full rounded-lg bg-yellow-300 opacity-0 transition-opacity group-hover:opacity-100" style={{ filter: "url(#squiggle)" }} />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
};

export function StickyNote({ children, color = "bg-yellow-200", rotate = 0, className }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.1, rotate: rotate * -1, zIndex: 10 }}
            className={cn(
                "relative flex h-64 w-64 flex-col justify-between p-6 shadow-sm",
                color,
                className
            )}
            style={{
                filter: "url(#squiggle)",
                transform: `rotate(${rotate}deg)`
            }}
        >
            <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 bg-white/40 shadow-sm rotate-1" />
            <div className="font-handwriting text-slate-800 text-lg leading-relaxed">
                {children}
            </div>
            <div className="self-end opacity-50">
                <Scissors size={16} />
            </div>
        </motion.div>
    )
}

// --- 3. Graph Paper Background ---
export function GraphPaper() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#f6ebdc]">
            <div className="absolute inset-0 opacity-12"
                style={{ backgroundImage: "linear-gradient(#c7a17f 1px, transparent 1px), linear-gradient(90deg, #c7a17f 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="absolute inset-0 opacity-25" style={{ filter: "url(#pencil-texture)" }} />
        </div>
    );
}

// --- 4. Hero Section with Live Drawing ---
export function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-4">
            <div className="relative mb-6 text-center">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
                    className="absolute bottom-2 left-0 -z-10 h-6 w-full origin-left -rotate-1 rounded-sm bg-amber-300/50"
                    style={{ filter: "url(#squiggle)" }}
                />
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-amber-700">
                    TalentIQ AI
                </span>
            </div>

            <h1 className="relative text-center text-6xl font-black tracking-tight text-slate-900 md:text-8xl">
                Recruit with <span className="relative inline-block text-red-500 italic">
                    confidence
                    <svg className="absolute -left-4 -top-6 h-[140%] w-[120%] overflow-visible text-red-500 pointer-events-none" style={{ filter: "url(#squiggle)" }}>
                        <motion.path
                            d="M 10 30 C 50 10 150 10 170 30"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                        />
                    </svg>
                </span> <br />
                with AI-driven hiring.
            </h1>

            <p className="mt-8 max-w-lg text-center font-medium text-slate-500 text-lg leading-relaxed">
                Intelligent candidate screening, interview orchestration, and offer management in one polished workspace built for modern talent teams.
            </p>

            <div className="mt-12 flex gap-6">
                <SketchButton>
                    Start Hiring <ArrowRight size={18} />
                </SketchButton>
                <button className="px-6 py-3 font-mono text-sm font-bold text-slate-500 underline decoration-wavy underline-offset-4 hover:text-slate-900">
                    Explore Features
                </button>
            </div>

            <div className="mt-20 w-full max-w-4xl">
                <div className="relative aspect-video w-full rounded-xl border-2 border-slate-900 bg-white p-4 shadow-xl" style={{ filter: "url(#squiggle)" }}>
                    <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-4 mb-8">
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-red-400" />
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-green-400" />
                    </div>
                    <div className="grid grid-cols-12 gap-4 h-64">
                        <motion.div initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1, delay: 0.5 }} className="col-span-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50" />
                        <div className="col-span-9 flex flex-col gap-4">
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 1 }} className="h-32 w-full rounded-lg border-2 border-slate-900 bg-blue-50" />
                            <div className="flex gap-4 h-full">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1.8 }} className="h-full w-1/2 rounded-lg border-2 border-slate-900 bg-yellow-50" />
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 2.0 }} className="h-full w-1/2 rounded-lg border-2 border-slate-900 bg-pink-50" />
                            </div>
                        </div>
                    </div>
                    <motion.div initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 200, 400, 300], y: [0, 100, 50, 200], opacity: 1 }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }} className="absolute top-0 left-0 pointer-events-none">
                        <PenTool className="h-8 w-8 text-slate-900 -rotate-12 drop-shadow-lg" fill="white" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// --- 5. Features (Sticky Notes Board) ---
export function FeatureBoard() {
    return (
        <section id="platform" className="py-32 px-4 overflow-hidden relative">
            <div className="mx-auto max-w-6xl">
                <div className="mb-20 flex items-end justify-between border-b-2 border-slate-900 pb-4">
                    <h2 className="text-4xl font-black text-slate-900">
                        The <span className="text-blue-600 decoration-wavy underline italic">Talent</span> Blueprint.
                    </h2>
                    <Ruler className="text-slate-400" />
                </div>
                <div className="flex flex-wrap justify-center gap-12">
                    {[
                        { icon: <Layout />, color: "bg-yellow-200", title: "Pipeline Visibility", desc: "See every candidate stage clearly and keep hiring moving." },
                        { icon: <Shapes />, color: "bg-blue-200", title: "AI Match", desc: "Surface the strongest candidates with automated scoring." },
                        { icon: <PenTool />, color: "bg-pink-200", title: "Faster Offers", desc: "Turn interviews into hires with built-in offer workflows." }
                    ].map((f, i) => (
                        <StickyNote key={i} rotate={i % 2 === 0 ? -2 : 2} color={f.color}>
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                            <p className="text-sm">{f.desc}</p>
                        </StickyNote>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- 6. Sketchbook Showcase (Horizontal Scroll) ---
export function SketchbookShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (!sectionRef.current || !triggerRef.current) return;

        const pin = gsap.to(sectionRef.current, {
            x: "-66%",
            ease: "none",
            scrollTrigger: {
                trigger: triggerRef.current,
                pin: true,
                scrub: 1,
                end: () => `+=${sectionRef.current!.offsetWidth}`,
            }
        });
        return () => {
            if (pin) pin.kill();
        };
    }, []);

    const projects = [
        {
            title: "ATS Resume Analyzer",
            tag: "#AI-Powered",
            color: "bg-blue-50",
            subtitle: "AI-powered resume scoring",
            useImage: true,
            imageSrc: "/src/assets/ats-resume.png",
            imageAlt: "ATS Resume",
            buttonText: "Check ATS Score",
        },
        {
            title: "Mock Interview",
            tag: "#Screening",
            color: "bg-red-50",
            subtitle: "Practice interviews with AI",
            useImage: true,
            imageSrc: "/src/assets/mock-interview.png",
            imageAlt: "Mock Interview",
            buttonText: "Start Mock Interview",
        },
        {
            title: "Coding Assessment",
            tag: "#Assessment",
            color: "bg-green-50",
            subtitle: "Evaluate coding skills with timed tests",
            useImage: true,
            imageSrc: "/src/assets/coding-assessment.png",
            imageAlt: "Coding Assessment",
            buttonText: "Take Assessment",
        },
    ];

    return (
        <section ref={triggerRef} className="overflow-hidden bg-[#fdfbf7] border-y-2 border-slate-900">
            <div ref={sectionRef} className="flex w-[300%] h-screen">
                {projects.map((p, i) => (
                    <div key={i} className="w-screen h-full flex items-center justify-center p-20 relative border-r-2 border-slate-200">
                        <div className="absolute top-10 left-10 text-8xl font-black text-slate-100 uppercase pointer-events-none">
                            Flow {i + 1}
                        </div>
                        <div className={cn("w-full max-w-4xl aspect-[4/3] border-4 border-slate-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6", p.color)} style={{ filter: "url(#squiggle)" }}>
                            <div className="flex-1 border-2 border-dashed border-slate-400 rounded-xl overflow-hidden bg-white/50">
                                {p.useImage ? (
                                    <img 
                                        src={p.imageSrc}
                                        alt={p.imageAlt}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PenTool size={100} className="text-slate-200" />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="font-mono text-xs uppercase text-slate-400">{p.tag}</span>
                                    <h3 className="text-4xl font-black text-slate-900">{p.title}</h3>
                                    {p.subtitle && (
                                        <p className="text-sm text-slate-600 mt-1">{p.subtitle}</p>
                                    )}
                                </div>
                                <SketchButton className="bg-white">
                                    {p.buttonText ?? "View Demo"}
                                </SketchButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- 7. Process Path (Scroll-Driven Path) ---
export function ProcessPath() {
    const container = useRef<HTMLElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useLayoutEffect(() => {
        const path = pathRef.current;
        if (!path) return;

        // Get total path length
        const totalLength = path.getTotalLength();
        
        gsap.set(path, {
            strokeDasharray: totalLength,
            strokeDashoffset: totalLength
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        });
    }, []);

    const steps = [
        { 
            title: "Upload Resume", 
            icon: <Shapes />,
            description: "Start your journey by uploading your resume and let our AI analyze it for key skills and experience."
        },
        { 
            title: "Calculate ATS Score", 
            icon: <Layout />,
            description: "Get an instant ATS score to see how well your resume matches job requirements and optimize it."
        },
        { 
            title: "Mock-Interview", 
            icon: <PenTool />,
            description: "Practice with AI-powered mock interviews to prepare and build confidence for real interviews."
        },
        { 
            title: "Coding Assessment", 
            icon: <Zap />,
            description: "Evaluate your coding skills with challenging assessments and get detailed feedback to improve."
        }
    ];

    return (
        <section ref={container} className="py-48 px-4 bg-white relative">
            <div className="mx-auto max-w-4xl relative">
                <svg className="absolute left-[50px] top-0 h-full w-[100px] overflow-visible pointer-events-none" viewBox="0 0 100 1000" preserveAspectRatio="none">
                    <path 
                        ref={pathRef}
                        d="M 50 0 Q 100 250 50 500 T 50 1000" 
                        fill="transparent" 
                        stroke="#cbd5e1" 
                        strokeWidth="8" 
                        style={{ filter: "url(#squiggle)" }}
                    />
                </svg>

                <div className="space-y-48 relative z-10">
                    {steps.map((s, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-12 group"
                        >
                            <div className="h-28 w-28 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center group-hover:bg-yellow-300 transition-colors shadow-xl" style={{ filter: "url(#squiggle)" }}>
                                {React.cloneElement(s.icon as React.ReactElement<any>, { size: 40 })}
                            </div>
                            <div className="p-8 border-2 border-slate-900 rounded-2xl bg-white shadow-lg flex-1" style={{ filter: "url(#squiggle)" }}>
                                <h3 className="text-3xl font-black text-slate-900 mb-2">{s.title}</h3>
                                <p className="text-slate-500 font-medium">{s.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- 8. Client Scribbles (Masonry Testimonials) ---
export function ClientScribbles() {
    return (
        <section id="customers" className="py-32 bg-[#f8fafc] border-y-2 border-slate-900">
            <div className="mx-auto max-w-7xl px-4">
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-black text-slate-900 italic">Trusted by Talent Teams</h2>
                    <div className="h-1 w-24 bg-red-400 mx-auto mt-4" style={{ filter: "url(#squiggle)" }} />
                </div>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {[
                        { text: "We cut screening time by half and still made better hires.", author: "Avery, Recruiting Lead", color: "bg-blue-100" },
                        { text: "The AI match engine keeps our pipeline full of qualified candidates.", author: "Jordan, Talent Partner", color: "bg-yellow-100" },
                        { text: "Our offer acceptance rate improved after we centralized interview feedback.", author: "Morgan, People Ops", color: "bg-pink-100" },
                        { text: "The platform gives our team confidence and keeps hiring moving.", author: "Taylor, Head of Recruitment", color: "bg-green-100" },
                        { text: "Hiring finally feels efficient, visible, and human-driven.", author: "Chris, HR Director", color: "bg-indigo-100" }
                    ].map((t, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className={cn("break-inside-avoid p-8 border-2 border-slate-900 rounded-3xl shadow-lg relative h-auto inline-block w-full text-slate-900", t.color)}
                            style={{ filter: "url(#squiggle)" }}
                        >
                            <MessageCircle className="absolute -top-4 -right-4 h-10 w-10 text-slate-900 bg-white rounded-full p-2 border-2 border-slate-900" />
                            <p className="font-handwriting text-2xl mb-6 text-slate-800 leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <span className="font-black text-slate-900 uppercase tracking-widest text-xs">— {t.author}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- 9. Rough Pricing (Scribble Cards) ---
export function PricingDrafts() {
    return (
        <section id="pricing" className="py-48 px-4 bg-white">
            <div className="mx-auto max-w-6xl">
                <div className="text-center mb-24">
                    <span className="font-mono text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded">Plans for teams</span>
                    <h2 className="text-6xl font-black text-slate-900 mt-4">Staff smarter with <span className="text-red-500 underline decoration-wavy">AI</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Starter", price: "$0", features: ["Single pipeline", "Basic AI suggestions", "Email support"] },
                        { title: "Growth", price: "$49", features: ["Unlimited jobs", "Candidate scoring", "Team collaboration"] },
                        { title: "Enterprise", price: "$199", features: ["Dedicated onboarding", "Custom workflows", "Priority support"] }
                    ].map((p, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -10 }}
                            className="bg-white border-4 border-slate-900 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group text-slate-900"
                            style={{ filter: "url(#squiggle)" }}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Star size={40} className="text-yellow-400 group-hover:rotate-45 transition-transform duration-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-4">{p.title}</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black text-slate-900">{p.price}</span>
                                <span className="font-mono text-slate-400">/mo</span>
                            </div>
                            <ul className="space-y-6 mb-12">
                                {p.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 font-bold text-slate-600">
                                        <div className="h-2 w-2 rounded-full bg-slate-900" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <SketchButton className="w-full bg-slate-900 text-white hover:text-slate-900">Choose Plan</SketchButton>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- 10. Blueprint Footer ---
export function BlueprintFooter() {
    return (
        <footer className="bg-slate-900 pt-48 pb-20 px-4 text-[#fdfbf7] relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-32">
                    <div>
                        <h2 className="text-[10vw] lg:text-[7vw] font-black leading-none uppercase mb-8 italic">
                            Let's <br /> <span className="text-yellow-300">Hire</span>.
                        </h2>
                        <p className="text-2xl font-medium text-slate-400 max-w-md">
                            Build better teams faster with AI-powered screening, collaboration, and offer execution.
                        </p>
                    </div>
                    <div className="flex flex-col justify-end items-end gap-12">
                        <div className="grid grid-cols-2 gap-12 text-sm font-mono uppercase tracking-widest">
                            <ul className="space-y-4">
                                <li className="text-slate-500">Navigation</li>
                                <li><a href="#" className="hover:text-yellow-300">Home</a></li>
                                <li><a href="#" className="hover:text-yellow-300">Archive</a></li>
                                <li><a href="#" className="hover:text-yellow-300">Process</a></li>
                            </ul>
                            <ul className="space-y-4">
                                <li className="text-slate-500">Social</li>
                                <li><a href="#" className="hover:text-yellow-300">Twitter</a></li>
                                <li><a href="#" className="hover:text-yellow-300">Instagram</a></li>
                                <li><a href="#" className="hover:text-yellow-300">Dribbble</a></li>
                            </ul>
                        </div>
                        <div className="h-32 w-full max-w-sm border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center p-8 text-center text-xs font-mono opacity-40">
                            Coordinate System Enabled: <br /> 0.0000N / 0.0000W
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-slate-800 font-mono text-xs uppercase tracking-[0.3em] text-slate-500 gap-8">
                    <span>© 2026 TalentIQ AI</span>
                    <div className="flex gap-12">
                        <span>Legal / Terms</span>
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- 11. Marquee (Handwritten Tape) ---
export function TapeMarquee() {
    return (
        <div className="relative -rotate-2 bg-slate-900 py-6 overflow-hidden shadow-xl" style={{ filter: "url(#squiggle)" }}>
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                className="flex whitespace-nowrap"
            >
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 mx-8">
                        <span className="text-3xl font-black text-[#fdfbf7] uppercase tracking-widest font-handwriting">
                            Talent Search Active
                        </span>
                        <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export function SketchyLanding() {
    return (
        <div
            className="relative min-h-screen overflow-hidden bg-[#f8efe2] text-slate-900"
            style={{
                backgroundImage: `linear-gradient(rgba(248,239,226,0.92), rgba(237,222,205,0.92)), url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <SquiggleFilter />
            <GraphPaper />
            <div className="relative z-10">
                <nav className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <Link to="/" className="text-lg font-black tracking-tight text-slate-900">
                        TalentIQ
                    </Link>
                    <div className="hidden items-center gap-8 md:flex text-sm text-slate-700">
                        <a href="#platform" className="transition hover:text-slate-900">Platform</a>
                        <a href="#customers" className="transition hover:text-slate-900">Customers</a>
                    </div>
                    <Link
                        to="/login"
                        className="rounded-full border border-slate-900 bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                    >
                        Login
                    </Link>
                </nav>
                <Hero />
                <FeatureBoard />
                <SketchbookShowcase />
                <ProcessPath />
                <ClientScribbles />
                <BlueprintFooter />
                <TapeMarquee />
            </div>
        </div>
    )
}