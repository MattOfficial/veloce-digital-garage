"use client";

import { motion } from "framer-motion";

export function MotionWrapper({
    children,
    className,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
