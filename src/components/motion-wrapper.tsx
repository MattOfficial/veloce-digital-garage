"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MotionWrapper({
    children,
    className,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : Math.min(delay, 0.35),
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
