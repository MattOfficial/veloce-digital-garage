"use client";

import { useVibeEngine } from "vibe-particles/react";
import { SwarmPhysics, DotRenderer, NoInteraction } from "vibe-particles";

export function InteractiveBackground() {
    const { canvasRef } = useVibeEngine({
        // Use swarm physics (flees cursor) but swap in the crisp DotRenderer
        // instead of the blurry GlowRenderer that the mysterious preset uses.
        // NoInteraction because SwarmPhysics handles mouse internally.
        physics: SwarmPhysics,
        renderer: DotRenderer,
        interaction: NoInteraction,
        spacing: 28,           // tighter grid to match the showcase density
        baseRadius: 1,         // tiny, sharp dots
        rgb: [59, 130, 246],   // Veloce primary blue
    });

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
        />
    );
}
