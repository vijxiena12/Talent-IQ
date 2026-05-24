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

export function SketchButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95, rotate: 1 }}
            onClick={onClick}
            className={cn(
                "relative px-8 py-3 font-bold text-slate-800 transition-colors group cursor-pointer",
                className
            )}
        >
            <div className="absolute inset-0 h-full w-full" style={{ filter: "url(#squiggle)" }}>
                <svg className="h-full w-full overflow-visible">
                    <rect x="2" y="2" width="100%" height="100%" rx="8" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-slate-800" />
                </svg>
            </div>
            <div className="absolute inset-0 top-1 left-1 -z-10 h-full w-full rounded-lg bg-yellow-300 opacity-0 transition-opacity group-hover:opacity-100" style={{ filter: "url(#squiggle)" }} />
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </motion.button>
    );
};

export function StickyNote({ children, color = "bg-yellow-200", rotate = 0, className }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: rotate * -1, zIndex: 10 }}
            className={cn(
                "relative flex h-65 w-65 flex-col justify-between p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all duration-150",
                color,
                className
            )}
            style={{
                filter: "url(#squiggle)",
                transform: `rotate(${rotate}deg)`
            }}
        >
            <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 bg-white/40 shadow-sm rotate-1" />
            <div className="font-handwriting text-slate-800 text-2xl leading-relaxed">
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
        <section className="relative flex min-h-screen flex-col items-center justify-center pt-32 pb-16 overflow-hidden px-4">
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

            <p className="mt-8 max-w-lg text-center font-medium text-slate-500 text-lg leading-relaxed font-sans">
                Intelligent candidate screening, interview orchestration, and offer management in one polished workspace built for modern talent teams.
            </p>

            <div className="mt-12 flex gap-6 z-10">
                <Link to="/signup">
                    <SketchButton>
                        Start Hiring <ArrowRight size={18} />
                    </SketchButton>
                </Link>
                <a href="#platform" className="px-6 py-3 font-mono text-sm font-bold text-slate-500 underline decoration-wavy underline-offset-4 hover:text-slate-900">
                    Explore Features
                </a>
            </div>

            <div className="mt-20 w-full max-w-4xl px-4">
                <div className="relative w-full rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]" style={{ filter: "url(#squiggle)" }}>
                    <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-4 mb-6">
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-red-400" />
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full border border-slate-900 bg-green-400" />
                        <span className="font-mono text-[10px] text-slate-400 ml-2">talent-iq-dashboard.app</span>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-4 text-xs font-mono text-slate-700 min-h-[300px]">
                        {/* Sidebar */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="col-span-12 md:col-span-3 border-2 border-slate-900 rounded-xl bg-slate-50 p-3 flex flex-col gap-3 justify-between"
                        >
                            <div className="space-y-3">
                                <div className="font-bold border-b border-slate-900 pb-2 text-[10px] uppercase text-slate-400">TalentIQ App</div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 bg-yellow-200 border border-slate-900 p-1.5 rounded font-bold text-[10px] shadow-[2px_2px_0px_0px_#000]"><Layout size={10} /> Overview</div>
                                    <div className="flex items-center gap-1.5 p-1.5 hover:bg-slate-100 rounded text-[10px]"><User size={10} /> Candidates</div>
                                    <div className="flex items-center gap-1.5 p-1.5 hover:bg-slate-100 rounded text-[10px]"><Shapes size={10} /> ATS Engine</div>
                                </div>
                            </div>
                            <div className="text-[8px] text-slate-400 text-center font-mono">v1.2 // Active</div>
                        </motion.div>

                        {/* Main Work Area */}
                        <div className="col-span-12 md:col-span-9 flex flex-col gap-4">
                            {/* Analytics Summary */}
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="border-2 border-slate-900 rounded-xl bg-blue-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                            >
                                <div>
                                    <div className="font-black text-slate-900 text-[14px]">AI Resume Screening</div>
                                    <div className="text-[10px] text-slate-500 font-medium">Auto-filtering & scoring in progress</div>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-2.5 py-1 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-bold text-[9px] uppercase">94% Accuracy</span>
                                </div>
                            </motion.div>

                            {/* Candidate List & Sparkline Charts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                {/* Top Matches */}
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="border-2 border-slate-900 rounded-xl bg-yellow-50/50 p-3 flex flex-col justify-between"
                                >
                                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2 block">Top Match Stream</span>
                                    <div className="space-y-2">
                                        <div className="border border-slate-950 bg-white p-2 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-black text-[11px] text-slate-900">Sarah Jenkins</div>
                                                <div className="flex gap-1 mt-0.5">
                                                    <span className="bg-blue-100 text-[8px] px-1 rounded font-bold text-blue-700">React</span>
                                                    <span className="bg-purple-100 text-[8px] px-1 rounded font-bold text-purple-700">Node</span>
                                                </div>
                                            </div>
                                            <span className="font-black text-[11px] text-green-600 bg-green-50 border border-green-200 px-1 rounded">96%</span>
                                        </div>
                                        <div className="border border-slate-950 bg-white p-2 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-black text-[11px] text-slate-900">Alex Rivera</div>
                                                <div className="flex gap-1 mt-0.5">
                                                    <span className="bg-yellow-100 text-[8px] px-1 rounded font-bold text-yellow-700">Python</span>
                                                    <span className="bg-red-100 text-[8px] px-1 rounded font-bold text-red-700">AI</span>
                                                </div>
                                            </div>
                                            <span className="font-black text-[11px] text-yellow-600 bg-yellow-50 border border-yellow-200 px-1 rounded">89%</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Mini Chart Card */}
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1.0 }}
                                    className="border-2 border-slate-900 rounded-xl bg-pink-50 p-3 flex flex-col justify-between"
                                >
                                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">Velocity Index</span>
                                    <div className="flex-1 flex items-end min-h-[50px] mb-2">
                                        <svg className="w-full h-16 overflow-visible" viewBox="0 0 100 50">
                                            <path 
                                                d="M 0 45 Q 25 15 50 30 T 100 5" 
                                                fill="none" 
                                                stroke="#1e293b" 
                                                strokeWidth="3.5"
                                                style={{ filter: "url(#squiggle)" }}
                                            />
                                            <circle cx="100" cy="5" r="3" className="fill-red-500 stroke-slate-900 stroke-2" />
                                        </svg>
                                    </div>
                                    <span className="font-black text-[14px] text-slate-900 block">4.8x Screening Speed</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <motion.div initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 200, 400, 300], y: [0, 100, 50, 200], opacity: 1 }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }} className="absolute top-0 left-0 pointer-events-none hidden md:block">
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
                {/* Section Header */}
                <div className="text-center mb-24 max-w-3xl mx-auto relative">
                    {/* Floating Handwritten Tag */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 md:translate-x-12 md:left-2/3 flex items-center gap-1.5 font-handwriting text-2xl text-red-500 font-bold -rotate-3 z-10 whitespace-nowrap">
                        <span>⚠️ The hard truth</span>
                        <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                        >
                            <Star size={20} fill="currentColor" />
                        </motion.span>
                    </div>

                    <span className="font-mono text-xs uppercase tracking-widest text-red-650 font-bold bg-red-50 border-2 border-red-200 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(239,68,68,0.2)]">
                        The Core Friction
                    </span>

                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mt-6 leading-[1.1] tracking-tighter">
                        Why{" "}
                        <span 
                            className="relative inline-block px-5 py-1.5 text-white bg-red-500 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#000] -rotate-2 rounded-2xl mx-1"
                            style={{ filter: "url(#squiggle)" }}
                        >
                            Traditional
                        </span>{" "}
                        <br />
                        Hiring is{" "}
                        <span className="relative inline-block text-red-650 italic">
                            Broken
                            <svg className="absolute -left-2 -bottom-2 h-4 w-[115%] text-red-500 pointer-events-none overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0,5 C30,9 70,2 100,5" stroke="currentColor" strokeWidth="4" fill="none" style={{ filter: "url(#squiggle)" }} />
                            </svg>
                        </span>.
                    </h2>
                    
                    <p className="mt-8 text-slate-500 font-medium text-lg leading-relaxed max-w-xl mx-auto font-sans">
                        Both candidates and companies face structural roadblocks that turn recruitment into a slow, high-anxiety black box.
                    </p>
                </div>


                {/* 3-Column Problem Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {[
                        {
                            num: "01",
                            title: "The ATS Resume Trap",
                            subtitle: "The Filtering Abyss",
                            desc: "Over 75% of applications are discarded by rigid keyword bots before ever reaching human eyes. Candidates get zero feedback, and companies miss out on high-potential talent.",
                            color: "bg-red-50",
                            accentColor: "border-red-500 text-red-600 bg-red-100",
                            icon: <Scissors size={18} />,
                            rotate: "-rotate-1"
                        },
                        {
                            num: "02",
                            title: "The Prep Blindspot",
                            subtitle: "Anxiety & Misalignment",
                            desc: "Candidates face high-stakes technical coding tests and conversational screening interviews without any realistic, tailored practice. This leads to performance anxiety and false negatives.",
                            color: "bg-orange-50/70",
                            accentColor: "border-orange-500 text-orange-600 bg-orange-100",
                            icon: <MessageCircle size={18} />,
                            rotate: "rotate-1"
                        },
                        {
                            num: "03",
                            title: "Screening Bottlenecks",
                            subtitle: "Massive Recruiter Waste",
                            desc: "Talent teams spend over 140 hours monthly manually reviewing resumes and coordinating basic technical phone screens just to verify basic skills and conversational fluency.",
                            color: "bg-rose-50/70",
                            accentColor: "border-rose-500 text-rose-600 bg-rose-100",
                            icon: <Zap size={18} />,
                            rotate: "-rotate-1"
                        }
                    ].map((p, i) => (
                        <div
                            key={i}
                            className={`relative p-8 border-2 border-slate-900 rounded-3xl ${p.color} shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] hover:shadow-[10px_10px_0px_0px_rgba(30,41,59,1)] transition-all duration-300 flex flex-col justify-between`}
                            style={{
                                filter: "url(#squiggle)",
                                transform: p.rotate
                            }}
                        >
                            {/* Tape Decoration */}
                            <div className="absolute -top-3.5 left-12 h-7 w-20 bg-white/60 shadow-sm border border-slate-300 -rotate-1 rounded-sm" />
                            
                            <div className="relative">
                                {/* Top Badging */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`h-9 w-9 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${p.accentColor}`}>
                                        {p.icon}
                                    </div>
                                    <span className="text-xs font-black font-mono border-2 border-slate-950 px-2 py-0.5 rounded-lg bg-white shadow-[2px_2px_0px_0px_#000]">
                                        {p.num}
                                    </span>
                                </div>

                                <h3 className="font-black text-2xl text-slate-900 mb-4 font-heading tracking-tight leading-tight">
                                    {p.title}
                                </h3>
                                
                                <p className="text-slate-600 font-sans text-sm leading-relaxed mb-6 font-medium">
                                    {p.desc}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-dashed border-slate-900/10 flex justify-between items-center mt-auto">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{p.subtitle}</span>
                                <Scissors size={14} className="opacity-30" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
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
            link: "/resumes",
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
            link: "/screening",
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
            link: "/individual/assessment",
        },
    ];

    return (
        <section id="showcase" ref={triggerRef} className="overflow-hidden bg-[#fdfbf7] border-y-2 border-slate-900">
            <div ref={sectionRef} className="flex w-[300%] h-screen">
                {projects.map((p, i) => (
                    <div key={i} className="w-screen h-full flex items-center justify-center p-6 md:p-20 relative border-r-2 border-slate-200">
                        <div className="absolute top-10 left-10 text-6xl md:text-8xl font-black text-slate-100 uppercase pointer-events-none">
                            Flow {i + 1}
                        </div>
                        <div className={cn("w-full max-w-4xl aspect-[4/3] border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-4 md:p-8 flex flex-col gap-6", p.color)} style={{ filter: "url(#squiggle)" }}>
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                <div>
                                    <span className="font-mono text-xs uppercase text-slate-400">{p.tag}</span>
                                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 font-heading">{p.title}</h3>
                                    {p.subtitle && (
                                        <p className="text-sm text-slate-600 mt-1 font-sans">{p.subtitle}</p>
                                    )}
                                </div>
                                <Link to={p.link} className="w-full sm:w-auto">
                                    <SketchButton className="bg-white w-full sm:w-auto">
                                        {p.buttonText ?? "View Demo"}
                                    </SketchButton>
                                </Link>
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
        <section id="process" ref={container} className="py-48 px-4 bg-white relative">
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
                            <div className="h-28 w-28 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center group-hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]" style={{ filter: "url(#squiggle)" }}>
                                {React.cloneElement(s.icon as React.ReactElement<any>, { size: 40 })}
                            </div>
                            <div className="p-8 border-2 border-slate-900 rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] flex-1" style={{ filter: "url(#squiggle)" }}>
                                <h3 className="text-3xl font-black text-slate-900 mb-2 font-heading">{s.title}</h3>
                                <p className="text-slate-500 font-medium font-sans">{s.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- 8. Whiteboard Stats Component (Replaces ClientScribbles) ---
export function WhiteboardStats() {
    return (
        <section id="stats" className="py-32 bg-[#fdfbf7] border-y-2 border-slate-900 relative">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-24">
                    <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                        AI Reasoning Engine
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mt-4">
                        The Agentic <span className="text-blue-600 italic">Evaluation Matrix</span>
                    </h2>
                    <div className="h-1.5 w-32 bg-yellow-400 mx-auto mt-4 rounded-full" style={{ filter: "url(#squiggle)" }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { 
                            num: "01", 
                            label: "Resume Matcher", 
                            color: "bg-blue-100", 
                            desc: "Calculates an objective 0-100% ATS score using semantic similarity matching against job descriptions.",
                            status: "Active",
                            model: "MiniLM-L6",
                            icon: <Shapes className="h-5 w-5 text-blue-700" />
                        },
                        { 
                            num: "02", 
                            label: "Qualitative Evaluator", 
                            color: "bg-yellow-100", 
                            desc: "Extracts key candidate strengths, soft/hard skill gaps, and prepares custom technical probe areas.",
                            status: "Active",
                            model: "Qwen 2.5",
                            icon: <Layout className="h-5 w-5 text-yellow-700" />
                        },
                        { 
                            num: "03", 
                            label: "Question Generator", 
                            color: "bg-pink-100", 
                            desc: "Generates tailored technical, behavioral, and scenario interview questions specific to candidate deficits.",
                            status: "Active",
                            model: "Gemma 3",
                            icon: <PenTool className="h-5 w-5 text-pink-700" />
                        },
                        { 
                            num: "04", 
                            label: "Dynamic Assessor", 
                            color: "bg-green-100", 
                            desc: "Creates customized coding challenges (DSA) and technical MCQs tailored to the candidate's exact tech stack.",
                            status: "Active",
                            model: "Gemma 3",
                            icon: <Zap className="h-5 w-5 text-green-700" />
                        }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn("p-8 border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] hover:shadow-[10px_10px_0px_0px_rgba(30,41,59,1)] transition-all duration-300 relative flex flex-col justify-between min-h-[280px]", stat.color)}
                            style={{ filter: "url(#squiggle)" }}
                        >
                            {/* Tape Decoration */}
                            <div className="absolute -top-3.5 left-12 h-7 w-20 bg-white/60 shadow-sm border border-slate-300 -rotate-1 rounded-sm" />

                            <div>
                                <div className="flex justify-between items-start mb-6 mt-2">
                                    <div className="h-9 w-9 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                        {stat.icon}
                                    </div>
                                    <span className="text-xs font-black font-mono border-2 border-slate-950 px-2 py-0.5 rounded-lg bg-white shadow-[2px_2px_0px_0px_#000]">
                                        Agent {stat.num}
                                    </span>
                                </div>
                                <h3 className="font-bold text-2xl text-slate-900 mb-3 font-heading leading-tight">{stat.label}</h3>
                                <p className="text-slate-600 font-medium text-xs leading-relaxed font-sans">{stat.desc}</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-dashed border-slate-900/10 flex items-center justify-between font-mono text-[9px] uppercase font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    {stat.status}
                                </span>
                                <span className="bg-white/80 px-1.5 py-0.5 border border-slate-300 rounded">{stat.model}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BlueprintFooter() {
    return (
        <footer className="bg-slate-950 pt-28 pb-16 px-6 text-slate-100 relative overflow-hidden border-t-2 border-slate-900">
            {/* Subtle paper grid background opacity */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            
            <div className="mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Info (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <Link to="/" className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
                            <span className="bg-yellow-300 border-2 border-slate-900 p-1.5 rounded-lg text-lg shadow-[2px_2px_0px_0px_#000]">💼</span>
                            TalentIQ
                        </Link>
                        <p className="text-sm font-medium text-slate-450 max-w-sm font-sans leading-relaxed">
                            Empowering developers and recruitment teams with local, RAG-powered resume screening, conversational AI mock interviews, and automated technical sandboxes.
                        </p>
                        
                        {/* Operational badge */}
                        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            System Status: Operational
                        </div>
                    </div>

                    {/* Navigation Columns (7 cols) */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
                        {/* Col 1 */}
                        <div className="space-y-4">
                            <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500">Platform</h4>
                            <ul className="space-y-2.5 text-sm font-medium text-slate-400 font-sans">
                                <li><a href="#platform" className="hover:text-yellow-300 transition-colors">Features</a></li>
                                <li><a href="#showcase" className="hover:text-yellow-300 transition-colors">Showcase</a></li>
                                <li><a href="#process" className="hover:text-yellow-300 transition-colors">Process</a></li>
                                <li><a href="#stats" className="hover:text-yellow-300 transition-colors">Metrics</a></li>
                            </ul>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-4">
                            <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500">Capabilities</h4>
                            <ul className="space-y-2.5 text-sm font-medium text-slate-400 font-sans">
                                <li><Link to="/resumes" className="hover:text-yellow-300 transition-colors">ATS Analyzer</Link></li>
                                <li><Link to="/screening" className="hover:text-yellow-300 transition-colors">Mock Interviews</Link></li>
                                <li><Link to="/individual/assessment" className="hover:text-yellow-300 transition-colors">Skill Testing</Link></li>
                                <li><a href="#stats" className="hover:text-yellow-300 transition-colors">Agent Matrix</a></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="space-y-4 col-span-2 md:col-span-1">
                            <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500">Community</h4>
                            <ul className="space-y-2.5 text-sm font-medium text-slate-400 font-sans">
                                <li><a href="#" className="hover:text-yellow-300 transition-colors">GitHub Repository</a></li>
                                <li><a href="#" className="hover:text-yellow-300 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-yellow-300 transition-colors">API Reference</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="pt-10 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span>© 2026 TalentIQ. Local Agent Inference Active.</span>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- 11. Marquee (Handwritten Tape) ---
export function TapeMarquee() {
    return (
        <div className="relative bg-slate-900 py-6 overflow-hidden shadow-xl" style={{ filter: "url(#squiggle)" }}>
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
            className="relative min-h-screen overflow-hidden bg-[#f8efe2] text-slate-900 font-sans"
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
                {/* Floating sticky neobrutalist navbar */}
                <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full">
                    <nav className="flex items-center justify-between px-6 py-3 border-2 border-slate-900 bg-white/95 backdrop-blur-md rounded-2xl shadow-[4px_4px_0px_0px_#1e293b] mt-4 transition-all duration-300">
                        <Link to="/" className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            <span className="bg-yellow-300 border-2 border-slate-900 p-1.5 rounded-lg text-sm">💼</span>
                            TalentIQ
                        </Link>
                        <div className="hidden items-center gap-8 md:flex text-xs uppercase tracking-wider font-bold text-slate-700 font-mono">
                            <a href="#platform" className="hover:text-blue-600 transition-colors">Features</a>
                            <a href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</a>
                            <a href="#process" className="hover:text-blue-600 transition-colors">Process</a>
                            <a href="#stats" className="hover:text-blue-600 transition-colors">Metrics</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-slate-900">
                                Login
                            </Link>
                            <Link to="/signup">
                                <button className="px-4 py-2 font-bold text-slate-900 bg-yellow-300 hover:bg-yellow-400 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all duration-100 text-[10px] uppercase tracking-wider cursor-pointer">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </nav>
                </header>

                <Hero />
                <FeatureBoard />
                <SketchbookShowcase />
                <ProcessPath />
                <WhiteboardStats />
                <BlueprintFooter />
                <TapeMarquee />
            </div>
        </div>
    )
}