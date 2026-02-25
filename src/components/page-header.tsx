import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description: React.ReactNode;
    icon: LucideIcon;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, icon: Icon, children, className = "" }: PageHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Icon className="h-8 w-8 text-primary shrink-0" />
                    {title}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {description}
                </p>
            </div>
            {children && <div className="shrink-0">{children}</div>}
        </div>
    );
}
