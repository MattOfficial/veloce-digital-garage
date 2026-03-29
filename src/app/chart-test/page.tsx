"use client";

import { useState, useEffect } from "react";

export default function ChartTestPage() {
  const [test, setTest] = useState("initial");

  useEffect(() => {
    setTest("mounted");
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Chart Test</h1>
      <p className="text-muted-foreground mb-4">React test: {test}</p>

      {/* Basic colored divs */}
      <div className="mb-8">
        <h2 className="text-lg mb-2">1. Basic Colored Divs</h2>
        <div className="flex gap-4 h-[100px]">
          <div className="flex-1 bg-red-500 rounded">Red</div>
          <div className="flex-1 bg-blue-500 rounded">Blue</div>
          <div className="flex-1 bg-green-500 rounded">Green</div>
        </div>
      </div>

      {/* CSS variable test */}
      <div className="mb-8">
        <h2 className="text-lg mb-2">2. CSS Variables</h2>
        <div
          style={{
            "--test-color": "purple",
          } as React.CSSProperties}
          className="h-[100px] bg-[var(--test-color)] rounded flex items-center justify-center"
        >
          <span className="text-white font-bold">Purple from CSS var</span>
        </div>
      </div>

      {/* Simple recharts */}
      <div className="mb-8">
        <h2 className="text-lg mb-2">3. Simple SVG</h2>
        <svg width="300" height="200" className="border">
          <rect x="10" y="50" width="50" height="100" fill="red" />
          <rect x="70" y="20" width="50" height="130" fill="blue" />
          <rect x="130" y="70" width="50" height="80" fill="green" />
          <rect x="190" y="0" width="50" height="150" fill="orange" />
        </svg>
      </div>

      {/* recharts BarChart */}
      <div className="mb-8">
        <h2 className="text-lg mb-2">4. Recharts (dynamic import)</h2>
        <RechartsTest />
      </div>

      {/* Debug */}
      <div className="p-4 bg-muted rounded-lg mt-8">
        <p>If you see colored divs above, React and Tailwind work.</p>
        <p>If SVG shows bars, SVG rendering works.</p>
        <p>If recharts is blank, something is wrong with recharts import.</p>
      </div>
    </div>
  );
}

// Separate component to isolate recharts import
function RechartsTest() {
  const [BarChart, setBarChart] = useState<any>(null);
  const [Bar, setBar] = useState<any>(null);
  const [XAxis, setXAxis] = useState<any>(null);
  const [YAxis, setYAxis] = useState<any>(null);

  useEffect(() => {
    import("recharts").then((mod) => {
      setBarChart(() => mod.BarChart);
      setBar(() => mod.Bar);
      setXAxis(() => mod.XAxis);
      setYAxis(() => mod.YAxis);
    });
  }, []);

  if (!BarChart) return <div>Loading recharts...</div>;

  const data = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 200 },
    { name: "Mar", value: 150 },
  ];

  return (
    <div className="h-[200px] border rounded p-2">
      <BarChart data={data} width={300} height={180}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" fill="var(--color-primary, #3b82f6)" />
      </BarChart>
    </div>
  );
}
