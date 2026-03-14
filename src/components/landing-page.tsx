"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Car, Fuel, Wrench, Activity, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
    {
        title: "Digital Vehicle Garage",
        description: "Store all your vehicles in one central cloud garage. Quickly switch between vehicles to view their dedicated statistics.",
        icon: Car,
        delay: 0.1,
    },
    {
        title: "Fuel Logs & Efficiency",
        description: "Log every fill-up and track your true MPG. Visualize your fuel efficiency trends over time with dynamic charts.",
        icon: Fuel,
        delay: 0.2,
    },
    {
        title: "Maintenance Tracker",
        description: "Never miss a service. Keep a detailed history of oil changes, tire rotations, and custom maintenance events.",
        icon: Wrench,
        delay: 0.3,
    },
    {
        title: "Real-time Telemetry",
        description: "Experience your vehicle data like never before with our experimental high-performance HUD.",
        icon: Activity,
        delay: 0.4,
    },
    {
        title: "Cost Analytics",
        description: "Understand your vehicle running costs. Calculate total spend per mile to make informed decisions.",
        icon: BarChart3,
        delay: 0.5,
    },
    {
        title: "Secure & Cloud-Synced",
        description: "Built on Supabase for enterprise-grade security. Access your garage securely from any device, anytime.",
        icon: ShieldCheck,
        delay: 0.6,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingPage() {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden w-full px-4 sm:px-6 lg:px-8">
            {/* The interactive background is already in layout.tsx, but this is the content container */}

            <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center pt-24 pb-16 z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center w-full max-w-3xl mx-auto mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm"
                    >
                        <Car className="w-4 h-4" />
                        <span>The Ultimate Vehicle Management Platform</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent italic">
                        Veloce Digital Garage
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-light">
                        Track fuel, log maintenance, and monitor your vehicle statistics with unparalleled elegance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login?tab=signup" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full rounded-full text-md h-14 px-8 group font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full rounded-full text-md h-14 px-8 border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="bg-veloce-glass backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/5 hover:border-white/10 transition-all duration-500 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* Simple Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="py-8 text-center text-sm text-muted-foreground z-10 w-full mt-auto"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Car className="w-4 h-4" />
                    <span className="font-semibold italic">Digital Garage</span>
                </div>
                <p>&copy; {new Date().getFullYear()} Modern Fuel & Vehicle Tracking.</p>
            </motion.footer>
        </div>
    );
}
