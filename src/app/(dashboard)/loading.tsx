"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Pulsing Container */}
            <motion.div
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                    ease: "easeInOut",
                }}
                className="relative z-10 flex flex-col items-center justify-center p-8 bg-background/50 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl"
            >
                {/* Sleek icon wrapper */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-5 rounded-2xl border border-primary/20 flex items-center justify-center relative z-10">
                        <motion.div
                            animate={{
                                y: [0, -4, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut",
                            }}
                        >
                            <Car className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" strokeWidth={1.5} />
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-3 text-center w-full max-w-[200px]">
                    <div className="h-4 bg-muted/50 rounded flex overflow-hidden">
                        <motion.div
                            className="h-full bg-primary/50"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut",
                            }}
                        />
                    </div>
                    <div className="h-3 w-3/4 mx-auto bg-muted/30 rounded" />
                </div>

                <p className="mt-8 text-sm font-medium text-muted-foreground tracking-widest uppercase">
                    Loading telemetry
                </p>
            </motion.div>
        </div>
    );
}
