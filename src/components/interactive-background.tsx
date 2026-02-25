"use client";

import React, { useEffect, useRef } from "react";

export function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let mouse = { x: -1000, y: -1000 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            density: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = 1.2;
                this.density = Math.random() * 30 + 10;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                ctx.fill();
            }

            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;

                // Repulsion radius
                const maxDistance = 120;
                let force = (maxDistance - distance) / maxDistance;
                if (force < 0) force = 0;

                let directionX = forceDirectionX * force * this.density * 1.5;
                let directionY = forceDirectionY * force * this.density * 1.5;

                // When mouse is close, push particles away
                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Return to base position with eased spring physics
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 15;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 15;
                    }
                }
                this.draw();
            }
        }

        const initParticles = () => {
            particles = [];
            const spacing = 35; // dot grid spacing
            // offset to center the grid
            const offsetX = (canvas.width % spacing) / 2;
            const offsetY = (canvas.height % spacing) / 2;

            for (let y = offsetY; y < canvas.height; y += spacing) {
                for (let x = offsetX; x < canvas.width; x += spacing) {
                    particles.push(new Particle(x, y));
                }
            }
        };

        resize();

        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.003;

            // Draw background ambient glow
            // Top right blue glow
            const x1 = canvas.width * 0.8 + Math.cos(time) * 150;
            const y1 = canvas.height * 0.2 + Math.sin(time) * 150;
            const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 800);
            gradient1.addColorStop(0, "rgba(59, 130, 246, 0.18)");
            gradient1.addColorStop(1, "rgba(59, 130, 246, 0)");
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Bottom left emerald glow
            const x2 = canvas.width * 0.2 + Math.sin(time) * 150;
            const y2 = canvas.height * 0.8 + Math.cos(time) * 150;
            const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 800);
            gradient2.addColorStop(0, "rgba(16, 185, 129, 0.12)");
            gradient2.addColorStop(1, "rgba(16, 185, 129, 0)");
            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and update particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1]"
        />
    );
}
