"use client";

import { useEffect, useRef } from "react";
import {
  createNatureParticles,
  updateNatureParticle,
  getCanopyBranchCurves,
  getNatureThemeColors,
  type NatureParticle,
} from "@/utils/ev-nature-engine";

interface EvNatureBackgroundProps {
  isDark?: boolean;
}

export function EvNatureBackground({ isDark = true }: EvNatureBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX: number | undefined;
    let mouseY: number | undefined;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = undefined;
      mouseY = undefined;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Respect reduced-motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 40 particles is gentle on GPU and looks balanced
    let particles: NatureParticle[] = createNatureParticles(40, width, height);
    let time = 0;
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const colors = getNatureThemeColors(isDark);
      const breeze = 1.0;

      // 1. Draw organic canopy branches arching from top corners
      const curves = getCanopyBranchCurves(width, height, time, breeze);

      ctx.save();
      ctx.strokeStyle = colors.branchStroke;
      ctx.lineWidth = 14;
      ctx.lineCap = "round";

      // Top-left canopy
      ctx.beginPath();
      ctx.moveTo(curves.topLeft.start[0], curves.topLeft.start[1]);
      ctx.bezierCurveTo(
        curves.topLeft.cp1[0],
        curves.topLeft.cp1[1],
        curves.topLeft.cp2[0],
        curves.topLeft.cp2[1],
        curves.topLeft.end[0],
        curves.topLeft.end[1]
      );
      ctx.stroke();

      // Top-right canopy
      ctx.beginPath();
      ctx.moveTo(curves.topRight.start[0], curves.topRight.start[1]);
      ctx.bezierCurveTo(
        curves.topRight.cp1[0],
        curves.topRight.cp1[1],
        curves.topRight.cp2[0],
        curves.topRight.cp2[1],
        curves.topRight.end[0],
        curves.topRight.end[1]
      );
      ctx.stroke();
      ctx.restore();

      // 2. Draw drifting leaves and glowing spores
      particles = particles.map((p) => {
        const updated = prefersReducedMotion
          ? p
          : updateNatureParticle(p, width, height, breeze, mouseX, mouseY);

        ctx.save();
        ctx.translate(updated.x, updated.y);
        ctx.rotate(updated.angle);

        if (updated.type === "leaf") {
          // Leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, updated.size, updated.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${colors.leafFill}${updated.opacity})`;
          ctx.fill();

          // Leaf vein
          ctx.strokeStyle = colors.leafVein;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-updated.size * 0.75, 0);
          ctx.lineTo(updated.size * 0.75, 0);
          ctx.stroke();
        } else {
          // Bioluminescent spore
          const glowRadius = updated.size * 1.4;
          const radGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, glowRadius);
          radGrad.addColorStop(0, `${colors.sporeCenter}${updated.opacity * 1.5})`);
          radGrad.addColorStop(1, colors.sporeGlow);

          ctx.beginPath();
          ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = radGrad;
          ctx.fill();
        }

        ctx.restore();
        return updated;
      });

      if (!prefersReducedMotion) {
        time += 0.012;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] transition-opacity duration-700"
    />
  );
}
