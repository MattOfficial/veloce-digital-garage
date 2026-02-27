"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TelemetryHud() {
    const [state, setState] = useState({
        speed: 0,
        targetSpeed: 0,
        rpm: 800,
        gear: 1,
        throttle: 0,
        brake: 0,
        gForce: { x: 0, y: 0 },
        temp: 90,
    });

    const [speedHistory, setSpeedHistory] = useState<number[]>(Array(30).fill(5));
    const [rpmHistory, setRpmHistory] = useState<number[]>(Array(30).fill(5));
    const [logs, setLogs] = useState<string[]>([
        "> INITIATING HANDSHAKE... OK",
        "> ECU CALIBRATION... DONE",
        "> AERO SENSORS... ACTIVE",
        "> TRACTION CTRL... T1"
    ]);

    const maxSpeed = 320;
    const maxRpm = 9000;
    const idleRpm = 800;

    useEffect(() => {
        const simMessages = [
            "ADJUSTING BRAKE BIAS: R40 / F60",
            "AERO PROFILES: SPORT MODE",
            "BATTERY REGEN: ACTIVE",
            "TYRE TEMP: OPTIMAL",
            "DOWNFORCE: +120kg",
            "SUSPENSION: STIFF"
        ];

        const logInterval = setInterval(() => {
            setLogs(prev => {
                const newLogs = [...prev];
                newLogs.shift();
                newLogs.push(`> ${simMessages[Math.floor(Math.random() * simMessages.length)]}`);
                return newLogs;
            });
        }, 3000);

        const logicInterval = setInterval(() => {
            setState(prev => {
                let newTargetSpeed = prev.targetSpeed;
                if (Math.random() < 0.05) {
                    newTargetSpeed = Math.floor(Math.random() * 280);
                }

                const diff = newTargetSpeed - prev.speed;
                const newSpeed = prev.speed + diff * 0.05;

                let targetGear = Math.max(1, Math.ceil((newSpeed / maxSpeed) * 7));
                if (newSpeed < 5) targetGear = 1;

                const gearSpeedRange = maxSpeed / 7;
                const speedInCurrentGear = newSpeed - ((targetGear - 1) * gearSpeedRange);
                const rpmPercentage = speedInCurrentGear / gearSpeedRange;

                let newRpm = idleRpm + (rpmPercentage * (maxRpm - idleRpm));
                newRpm += (Math.random() * 200 - 100);
                if (newRpm > maxRpm) newRpm = maxRpm;
                if (newRpm < idleRpm) newRpm = idleRpm;

                const acceleration = diff;
                let newGY = -(acceleration * 0.05);
                let newGX = prev.gForce.x;
                if (newSpeed > 50) {
                    newGX += (Math.random() * 0.4 - 0.2);
                    newGX *= 0.9;
                } else {
                    newGX = 0;
                }

                let newTemp = prev.temp + (newRpm > 6000 ? 0.05 : -0.05);
                if (newTemp < 85) newTemp = 85;
                if (newTemp > 115) newTemp = 115;

                // Update charts
                setSpeedHistory(history => {
                    const newHist = [...history];
                    newHist.shift();
                    newHist.push((newSpeed / maxSpeed) * 100);
                    return newHist;
                });
                setRpmHistory(history => {
                    const newHist = [...history];
                    newHist.shift();
                    newHist.push((newRpm / maxRpm) * 100);
                    return newHist;
                });

                return {
                    speed: newSpeed,
                    targetSpeed: newTargetSpeed,
                    rpm: newRpm,
                    gear: targetGear,
                    throttle: 0,
                    brake: 0,
                    gForce: { x: newGX, y: newGY },
                    temp: newTemp
                };
            });
        }, 50);

        return () => {
            clearInterval(logInterval);
            clearInterval(logicInterval);
        };
    }, []);

    const isRedline = state.rpm > 8000;
    const colorRpm = isRedline ? 'text-rose-500' : 'text-sky-400';
    const bgRpm = isRedline ? 'bg-rose-500' : 'bg-sky-400';

    const tempPerc = ((state.temp - 80) / 40) * 100;
    const tempColor = state.temp > 105 ? 'bg-rose-500' : (state.temp > 95 ? 'bg-amber-400' : 'bg-sky-400');

    const gX = Math.max(-80, Math.min(80, state.gForce.x * 40));
    const gY = Math.max(-80, Math.min(80, state.gForce.y * 40));

    return (
        <div className="min-h-screen bg-gray-950 text-slate-50 flex items-center justify-center overflow-hidden relative font-mono select-none">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    maskImage: 'linear-gradient(to bottom, transparent, black)'
                }}>
            </div>

            <Link href="/" className="absolute top-8 left-8 z-50 text-slate-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition-all">
                <ArrowLeft className="w-4 h-4" /> Exit Telemetry
            </Link>

            <div className="w-[1400px] h-[800px] grid grid-cols-[300px_1fr_300px] grid-rows-[auto_1fr] gap-6 p-8 relative z-10">

                {/* Header */}
                <div className="col-span-3 flex justify-between items-center bg-gray-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>
                    <div className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        VELOCE TELEMETRY
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"></div>
                        LIVE SYSTEM LINK
                    </div>
                </div>

                {/* Left Panel */}
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col gap-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>

                    <div>
                        <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-2">Current Speed</div>
                        <div className="text-5xl font-light tabular-nums flex items-baseline gap-2">
                            {Math.floor(state.speed).toString().padStart(3, '0')}
                            <span className="text-base text-sky-400 font-semibold">km/h</span>
                        </div>
                        <div className="h-[60px] w-full flex items-end gap-[2px] mt-3">
                            {speedHistory.map((val, i) => (
                                <div key={i} className="flex-1 bg-sky-400/70 rounded-t-[2px] min-h-[5%] transition-all duration-75" style={{ height: `${Math.max(5, val)}%` }}></div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-2">Engine RPM</div>
                        <div className={`text-5xl font-light tabular-nums flex items-baseline gap-2 ${colorRpm}`}>
                            {Math.floor(state.rpm).toString().padStart(4, '0')}
                            <span className="text-base font-semibold">RPM</span>
                        </div>
                        <div className="h-[60px] w-full flex items-end gap-[2px] mt-3">
                            {rpmHistory.map((val, i) => (
                                <div key={i} className={`flex-1 rounded-t-[2px] min-h-[5%] transition-all duration-75 ${bgRpm} opacity-70`} style={{ height: `${Math.max(5, val)}%` }}></div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-2">Gear</div>
                        <div className="text-7xl font-bold text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                            {state.speed < 2 ? 'N' : state.gear}
                        </div>
                    </div>
                </div>

                {/* Center Panel: 3D Visualization */}
                <div className="flex flex-col items-center py-12 relative border border-white/5 rounded-2xl bg-gradient-to-b from-transparent to-sky-900/10">
                    <div className="relative w-[400px] h-[200px] mb-20" style={{ perspective: '800px' }}>
                        {/* CSS Car Wireframe Simulation */}
                        <div className="absolute inset-0 border-2 border-sky-400 rounded-[100px_100px_20px_20px] shadow-[0_0_30px_rgba(56,189,248,0.2),inset_0_0_30px_rgba(56,189,248,0.2)] bg-sky-400/5 flex items-center justify-center animate-[rotateCar_10s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="absolute w-[80%] h-[60%] border border-white/20 rounded-[40px_40px_10px_10px]" style={{ transform: 'translateZ(20px)' }}></div>
                            <div className="absolute w-[90%] h-[80%] border border-dashed border-sky-400/30 rounded-[60px_60px_15px_15px]" style={{ transform: 'translateZ(-20px)' }}></div>

                            <div className="absolute w-[60px] h-[60px] border-2 border-sky-400 rounded-full -bottom-[20px] left-[40px] shadow-[0_0_15px_#38bdf8] flex items-center justify-center">
                                <div className="absolute inset-[10px] border-2 border-dashed border-white/50 rounded-full animate-spin-slow"></div>
                            </div>
                            <div className="absolute w-[60px] h-[60px] border-2 border-sky-400 rounded-full -bottom-[20px] right-[40px] shadow-[0_0_15px_#38bdf8] flex items-center justify-center">
                                <div className="absolute inset-[10px] border-2 border-dashed border-white/50 rounded-full animate-spin-slow"></div>
                            </div>
                        </div>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes rotateCar {
                                0% { transform: rotateY(0deg) rotateX(10deg); }
                                100% { transform: rotateY(360deg) rotateX(10deg); }
                            }
                            .animate-spin-slow { animation: spin 1s linear infinite; }
                        `}} />
                    </div>

                    <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-6">Dynamic G-Force Vector</div>
                    <div className="w-[200px] h-[200px] rounded-full border-2 border-dashed border-white/10 relative flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }}>
                        <div className="absolute w-full h-[1px] bg-white/10"></div>
                        <div className="absolute w-[1px] h-full bg-white/10"></div>

                        <div
                            className="w-4 h-4 bg-rose-500 rounded-full absolute shadow-[0_0_20px_#f43f5e] z-10 transition-transform duration-100 ease-out"
                            style={{ transform: `translate(${gX}px, ${gY}px)` }}
                        ></div>

                        <div className="absolute -top-[20px] text-[10px] text-slate-400 tracking-[2px]">+1G ACCEL</div>
                        <div className="absolute -bottom-[20px] text-[10px] text-slate-400 tracking-[2px]">-1G BRAKE</div>
                        <div className="absolute -left-[30px] text-[10px] text-slate-400 tracking-[2px]">+1G LEFT</div>
                        <div className="absolute -right-[30px] text-[10px] text-slate-400 tracking-[2px]">-1G RIGHT</div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>

                    <div className="mb-8">
                        <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-2">Core Temp</div>
                        <div className="text-5xl font-light tabular-nums mb-3 flex items-baseline gap-2">
                            {state.temp.toFixed(1)} <span className="text-base text-sky-400 font-semibold">°C</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-200 ${tempColor}`} style={{ width: `${tempPerc}%` }}></div>
                        </div>
                    </div>

                    <div className="mb-14">
                        <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-2">Oil Pressure</div>
                        <div className="text-5xl font-light tabular-nums flex items-baseline gap-2">
                            4.2 <span className="text-base text-sky-400 font-semibold">BAR</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-2">Diagnostics</div>
                        <div className="font-mono text-xs text-emerald-400/80 leading-relaxed h-[100px] flex flex-col justify-end">
                            {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
