"use client";

import { useEffect, useRef } from "react";
import type { EnergyTheme } from "@/utils/energy-theme";
import {
  createThematicParticles,
  updatePetrolEmber,
  getPetrolAeroY,
  updateDieselParticle,
  getDieselPulseRings,
  updateHybridParticle,
  getHybridWaveY,
  getThematicColors,
  type ThemeParticle,
} from "@/utils/powertrain-theme-engine";
import {
  createNatureParticles,
  updateNatureParticle,
  getCanopyBranchCurves,
  getNatureThemeColors,
  type NatureParticle,
} from "@/utils/ev-nature-engine";

interface ThematicBackgroundProps {
  theme: EnergyTheme;
  isDark?: boolean;
}

export function ThematicBackground({ theme, isDark = true }: ThematicBackgroundProps) {
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

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let thematicParticles: ThemeParticle[] = createThematicParticles(theme, 45, width, height);
    let evParticles: NatureParticle[] = createNatureParticles(40, width, height);

    let time = 0;
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const colors = getThematicColors(theme, isDark);

      if (theme === "ev") {
        // EV: Swaying canopy branches & drifting botanical foliage
        const natureColors = getNatureThemeColors(isDark);
        const curves = getCanopyBranchCurves(width, height, time, 1.0);

        ctx.save();
        ctx.strokeStyle = natureColors.branchStroke;
        ctx.lineWidth = 14;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(curves.topLeft.start[0], curves.topLeft.start[1]);
        ctx.bezierCurveTo(
          curves.topLeft.cp1[0], curves.topLeft.cp1[1],
          curves.topLeft.cp2[0], curves.topLeft.cp2[1],
          curves.topLeft.end[0], curves.topLeft.end[1]
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(curves.topRight.start[0], curves.topRight.start[1]);
        ctx.bezierCurveTo(
          curves.topRight.cp1[0], curves.topRight.cp1[1],
          curves.topRight.cp2[0], curves.topRight.cp2[1],
          curves.topRight.end[0], curves.topRight.end[1]
        );
        ctx.stroke();
        ctx.restore();

        evParticles = evParticles.map((p) => {
          const updated = prefersReducedMotion
            ? p
            : updateNatureParticle(p, width, height, 1.0, mouseX, mouseY);

          ctx.save();
          ctx.translate(updated.x, updated.y);
          ctx.rotate(updated.angle);

          if (updated.type === "leaf") {
            ctx.beginPath();
            ctx.ellipse(0, 0, updated.size, updated.size * 0.45, 0, 0, Math.PI * 2);
            ctx.fillStyle = `${natureColors.leafFill}${updated.opacity})`;
            ctx.fill();

            ctx.strokeStyle = natureColors.leafVein;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-updated.size * 0.75, 0);
            ctx.lineTo(updated.size * 0.75, 0);
            ctx.stroke();
          } else {
            const glowRadius = updated.size * 1.4;
            const radGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, glowRadius);
            radGrad.addColorStop(0, `${natureColors.sporeCenter}${updated.opacity * 1.5})`);
            radGrad.addColorStop(1, natureColors.sporeGlow);

            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = radGrad;
            ctx.fill();
          }

          ctx.restore();
          return updated;
        });
      } else if (theme === "petrol") {
        // Petrol: Aerodynamic streamlines & rising combustion embers
        ctx.save();
        ctx.strokeStyle = colors.strokePrimary;
        ctx.lineWidth = 1.5;
        for (let y = 80; y < height; y += 130) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x <= width; x += 40) {
            ctx.lineTo(x, getPetrolAeroY(x, y, time));
          }
          ctx.stroke();
        }
        ctx.restore();

        thematicParticles = thematicParticles.map((p) => {
          const updated = prefersReducedMotion
            ? p
            : updatePetrolEmber(p, width, height, time, 1.0, mouseX, mouseY);

          ctx.beginPath();
          ctx.arc(updated.x, updated.y, updated.size, 0, Math.PI * 2);
          ctx.fillStyle = `${colors.particleFill}${updated.opacity})`;
          if (isDark) {
            ctx.shadowColor = colors.particleShadow;
            ctx.shadowBlur = colors.shadowBlur;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
          return updated;
        });
      } else if (theme === "diesel") {
        // Diesel: Kinetic compression pulse rings & golden torque dust
        ctx.save();
        const rings = getDieselPulseRings(time, 600, 3, isDark);
        const centerX = width * 0.5;
        const centerY = height * 0.45;

        rings.forEach((ring) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${colors.strokePrimary}${ring.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
        ctx.restore();

        thematicParticles = thematicParticles.map((p) => {
          const updated = prefersReducedMotion
            ? p
            : updateDieselParticle(p, width, height, 1.0);

          ctx.beginPath();
          ctx.arc(updated.x, updated.y, updated.size * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = `${colors.particleFill}${updated.opacity * (isDark ? 0.8 : 0.6)})`;
          if (isDark) {
            ctx.shadowColor = colors.particleShadow;
            ctx.shadowBlur = colors.shadowBlur;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
          return updated;
        });
      } else if (theme === "hybrid") {
        // Hybrid: Dual intertwined flux streams (electric cyan + kinetic mint)
        ctx.save();
        const centerY = height * 0.42;

        ctx.strokeStyle = colors.strokePrimary;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 30) {
          const y = getHybridWaveY(x, centerY, time, "electric");
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = colors.strokeSecondary;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 30) {
          const y = getHybridWaveY(x, centerY, time, "kinetic");
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        thematicParticles = thematicParticles.map((p) => {
          const updated = prefersReducedMotion
            ? p
            : updateHybridParticle(p, width, height, time, 1.0);

          ctx.beginPath();
          ctx.arc(updated.x, updated.y, updated.size, 0, Math.PI * 2);
          ctx.fillStyle =
            updated.stream === "electric"
              ? `${colors.particleFill}${updated.opacity})`
              : (isDark ? `rgba(52, 211, 153, ${updated.opacity})` : `rgba(5, 150, 105, ${updated.opacity * 0.6})`);
          if (isDark && updated.stream === "electric") {
            ctx.shadowColor = colors.particleShadow;
            ctx.shadowBlur = colors.shadowBlur;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
          return updated;
        });
      }

      if (!prefersReducedMotion) {
        time += 0.014;
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
  }, [theme, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] transition-opacity duration-700"
    />
  );
}
