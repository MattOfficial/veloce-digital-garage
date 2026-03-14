import { brand } from "@/content/en/brand";

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    tier: BadgeTier;
    icon: string;
}

export const BADGE_REGISTRY: Record<string, BadgeDefinition> = {
    'green_flag': { id: 'green_flag', name: 'Green Flag', description: `Added your first vehicle to the ${brand.app.genericName}`, tier: 'bronze', icon: 'Flag' },
    'first_drop': { id: 'first_drop', name: 'First Drop', description: 'Logged your first fuel entry', tier: 'bronze', icon: 'Droplet' },
    'wrench_ready': { id: 'wrench_ready', name: 'Wrench Ready', description: 'Logged your first maintenance record', tier: 'bronze', icon: 'Wrench' },
    'daily_driver': { id: 'daily_driver', name: 'Daily Driver', description: 'Logged 5 fuel entries', tier: 'silver', icon: 'Fuel' },
    'endurance_racer': { id: 'endurance_racer', name: 'Endurance Racer', description: 'Logged 20 fuel entries', tier: 'gold', icon: 'Timer' },
    'preventative_mindset': { id: 'preventative_mindset', name: 'Preventative Mindset', description: 'Logged 5 maintenance records', tier: 'silver', icon: 'ShieldCheck' },
    'fleet_manager': { id: 'fleet_manager', name: 'Fleet Manager', description: 'Maintained 3 or more vehicles at once', tier: 'gold', icon: 'Car' },
    'ai_mechanic': { id: 'ai_mechanic', name: 'AI Mechanic', description: `Used ${brand.ai.copilotName} to automatically extract a receipt`, tier: 'platinum', icon: 'Bot' },
};
