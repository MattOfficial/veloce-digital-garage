"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { brand } from "@/content/en/brand";

export function SpeedometerLoading() {
    const gaugeRef = useRef<SVGCircleElement>(null);
    const speedTextRef = useRef<HTMLDivElement>(null);
    const rpmTextRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentSpeed = 0;
        let targetSpeed = 160; // Simulate loading up to ~160 km/h
        let animationFrame: number;

        const MAX_SPEED = 240;
        const TOTAL_DASH = 816; // Circumference of r=130 is ~816
        const ACTIVE_DASH = 816 * 0.75; // 270 degrees

        // Initial state
        if (gaugeRef.current) {
            gaugeRef.current.style.strokeDashoffset = TOTAL_DASH.toString();
        }

        const updateGauge = () => {
            // Smooth interpolation (simulate an automatic transmission shifting up)
            // We'll add a little jitter to the target for realism
            const jitter = Math.sin(Date.now() / 200) * 2;
            currentSpeed += ((targetSpeed + jitter) - currentSpeed) * 0.05;

            // Update Readout
            if (speedTextRef.current) {
                speedTextRef.current.innerText = Math.round(currentSpeed).toString().padStart(3, '0');
            }

            // Fake Gears / RPM Engine sound
            if (rpmTextRef.current) {
                let rpm = 1000 + ((currentSpeed % 40) * 150);
                if (currentSpeed < 1) rpm = 800 + Math.random() * 50; // Idle wobble
                rpmTextRef.current.innerText = Math.round(rpm).toString();
            }

            // Update SVG Dashoffset
            if (gaugeRef.current) {
                const ratio = currentSpeed / MAX_SPEED;
                const offset = TOTAL_DASH - (ACTIVE_DASH * Math.max(0, ratio));
                gaugeRef.current.style.strokeDashoffset = offset.toString();
            }

            // Visual Glow
            if (glowRef.current) {
                const ratio = currentSpeed / MAX_SPEED;
                const glowIntensity = Math.max(0.2, ratio * 1.5);
                glowRef.current.style.opacity = glowIntensity.toString();
                glowRef.current.style.transform = `translate(-50%, -50%) scale(${1 + (ratio * 0.3)})`;
            }

            // Grid Parallax
            if (gridRef.current) {
                const animDuration = Math.max(0.5, 20 - (currentSpeed / 15));
                gridRef.current.style.animationDuration = `${animDuration}s`;
            }

            animationFrame = requestAnimationFrame(updateGauge);
        };

        animationFrame = requestAnimationFrame(updateGauge);

        // Gradually increase the target simulating download chunks
        const phase1 = setTimeout(() => { targetSpeed = 160; }, 500);
        const phase2 = setTimeout(() => { targetSpeed = 220; }, 1500);

        return () => {
            cancelAnimationFrame(animationFrame);
            clearTimeout(phase1);
            clearTimeout(phase2);
        };
    }, []);

    return (
        <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl bg-background/50 border border-white/5 backdrop-blur-xl">
            {/* The Infinite Highway Grid */}
            <div
                ref={gridRef}
                className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    animation: 'gridMove 20s linear infinite'
                }}
            />

            {/* Custom Keyframes for grid (we inject into page or it lives in globals. But since it's isolated, let's inject a style tag for the keyframes to keep the component portable) */}
            <style jsx>{`
                @keyframes gridMove {
                    0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
                    100% { transform: perspective(500px) rotateX(60deg) translateY(50px) translateZ(-200px); }
                }
                .speed-text {
                    font-variant-numeric: tabular-nums;
                }
            `}</style>

            {/* Gauge Wrapper */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-[300px] sm:w-[400px] aspect-square flex items-center justify-center z-10"
            >
                {/* Ambient Center Glow */}
                <div
                    ref={glowRef}
                    className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[40px] opacity-50 z-0 bg-[radial-gradient(circle,rgba(16,185,129,0.3)0%,transparent_70%)] transition-all duration-200"
                />

                {/* SVG Dial */}
                <svg viewBox="0 0 300 300" className="relative z-10 w-full h-full rotate-[135deg]">
                    <defs>
                        <linearGradient id="veloce-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>
                    {/* Background Track (270 degrees) */}
                    <circle
                        cx="150" cy="150" r="130"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray="816"
                        strokeDashoffset="204"
                    />
                    {/* Active Progress Bar */}
                    <circle
                        ref={gaugeRef}
                        cx="150" cy="150" r="130"
                        fill="none"
                        stroke="url(#veloce-gradient)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray="816"
                        strokeDashoffset="816"
                        className="transition-all duration-100 ease-linear drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                </svg>

                {/* Data Readout Center */}
                <div className="absolute flex flex-col items-center justify-center z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4">
                    <div ref={speedTextRef} className="text-5xl sm:text-6xl font-black tracking-[-2px] leading-none text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] speed-text">
                        000
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white/50 tracking-[2px] mt-1 uppercase">
                        {brand.app.fullName}
                    </div>
                    <div className="mt-4 text-[10px] sm:text-xs text-white/40 flex items-center gap-1 font-mono uppercase bg-black/50 px-3 py-1 rounded-full border border-white/10">
                        RPM <span ref={rpmTextRef} className="text-white/70 tabular-nums">1000</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
