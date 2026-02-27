import nlp from 'compromise';

export interface NLPEngineResult {
    intent: 'log_fuel_draft' | 'log_maintenance_draft' | 'unknown';
    payload?: any;
    missingInfo?: string;
}

export function parseMessage(messages: { role: string, content: string }[], vehicles: any[]): NLPEngineResult {
    let currentIntent: 'log_fuel_draft' | 'log_maintenance_draft' | 'unknown' = 'unknown';

    // Accumulators across the conversation piece
    let matchedVehicle = null;
    let vehicleName = "";
    let cost: number | null = null;
    let volume: number | null = null;
    let odometer: number | null = null;
    let serviceType = "General Service";

    const fuelKeywords = ['fuel', 'gas', 'petrol', 'diesel', 'fill', 'refuel', 'pump', 'tank', 'charge', 'charging', 'recharge', 'ev', 'plug', 'kwh'];
    const maintenanceKeywords = ['fix', 'repair', 'maintenance', 'oil', 'service', 'tire', 'tyre', 'brake', 'engine', 'mechanic', 'gearbox', 'transmission', 'battery', 'wash', 'detail', 'filter', 'fluid', 'replace', 'change', 'inspection'];

    for (const msg of messages) {
        if (msg.role !== 'user') continue;

        const doc = nlp(msg.content);
        const words = doc.terms().out('array').map((w: string) => w.toLowerCase());

        let msgIsFuel = false;
        let msgIsMaintenance = false;

        for (const word of words) {
            if (fuelKeywords.some(k => word.includes(k))) msgIsFuel = true;
            if (maintenanceKeywords.some(k => word.includes(k))) msgIsMaintenance = true;
        }

        if (msgIsFuel && currentIntent === 'unknown') currentIntent = 'log_fuel_draft';
        if (msgIsMaintenance && currentIntent === 'unknown') currentIntent = 'log_maintenance_draft';

        // Vehicle resolution (most recent mentions override older ones)
        for (const v of vehicles) {
            const makeMatch = v.make ? doc.match(v.make).found : false;
            const modelMatch = v.model ? doc.match(v.model).found : false;
            const nicknameMatch = v.nickname ? doc.match(v.nickname).found : false;

            if (makeMatch || modelMatch || nicknameMatch) {
                matchedVehicle = v.id;
                vehicleName = v.nickname || v.model || v.make;
            }
        }

        // Entity Extraction (Numbers)
        // Compromise numbers without the plugin return an object with a .num property if parsed
        const extractedNumbers = doc.numbers().json().map((n: any) => n.number?.num ?? n.number);
        const validNumbers = extractedNumbers.filter((n: any) => typeof n === 'number' && !isNaN(n)) as number[];

        if (validNumbers.length > 0) {
            // Contextual assignment based on the last message's numbers, 
            if (currentIntent === 'log_fuel_draft') {
                if (validNumbers.length >= 3) {
                    const sorted = [...validNumbers].sort((a, b) => b - a);
                    if (!odometer) odometer = sorted[0];
                    if (!cost) cost = sorted[1];
                    if (!volume) volume = sorted[2];
                } else if (validNumbers.length === 2) {
                    if (!odometer && !cost) {
                        odometer = Math.max(...validNumbers);
                        cost = Math.min(...validNumbers);
                    } else if (odometer && !cost && !volume) {
                        cost = Math.max(...validNumbers);
                        volume = Math.min(...validNumbers);
                    } else if (!odometer) {
                        odometer = Math.max(...validNumbers);
                    } else if (!cost) {
                        cost = validNumbers[0];
                    }
                } else if (validNumbers.length === 1) {
                    // Try to map a single number based on what is missing
                    if (!cost) cost = validNumbers[0];
                    else if (!volume) volume = validNumbers[0];
                    else if (!odometer) odometer = validNumbers[0];
                }
            } else if (currentIntent === 'log_maintenance_draft') {
                if (!cost) cost = Math.max(...validNumbers);
            } else {
                // Unknown intent so far, just store the first number as a generic cost just in case
                if (!cost) cost = validNumbers[0];
            }
        }

        // Try to extract dynamic phrasing like "gearbox oil change" or "replaced the battery"
        const pattern1 = doc.match('(#Noun|#Adjective)+ (change|repair|service|replacement|fix|fluid|inspection|wash|detail)').text();
        const pattern2 = doc.match('(replace|change|fix|repair|service|install) (#Noun|#Adjective)+').text();

        if (pattern1) {
            serviceType = pattern1.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        } else if (pattern2) {
            serviceType = pattern2.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        } else if (doc.has('gearbox') || doc.has('transmission')) serviceType = 'Transmission Service';
        else if (doc.has('engine')) serviceType = 'Engine Repair';
        else if (doc.has('battery')) serviceType = 'Battery Replacement';
        else if (doc.has('brake')) serviceType = 'Brake Service';
        else if (doc.has('tire') || doc.has('tyre')) serviceType = 'Tire Replacement';
        else if (doc.has('oil')) serviceType = 'Oil Change';
        else if (doc.has('wash') || doc.has('detail')) serviceType = 'Car Wash';
        else if (doc.has('filter')) serviceType = 'Filter Replacement';
    }

    if (currentIntent === 'log_fuel_draft') {
        if (!matchedVehicle) return { intent: currentIntent, missingInfo: "Which vehicle did you refuel? (e.g. your Honda or Datsun)" };
        if (!cost) return { intent: currentIntent, missingInfo: `How much did the fuel cost for the ${vehicleName}?` };
        if (!volume) return { intent: currentIntent, missingInfo: `How many liters/gallons/kWh did you put in to the ${vehicleName}?` };
        if (!odometer) return { intent: currentIntent, missingInfo: `What was the odometer reading for the ${vehicleName} during this fill up?` };

        return {
            intent: currentIntent,
            payload: {
                vehicle_id: matchedVehicle,
                cost,
                volume,
                odometer,
                date: new Date().toISOString().split('T')[0]
            }
        };
    }

    if (currentIntent === 'log_maintenance_draft') {
        if (!matchedVehicle) return { intent: currentIntent, missingInfo: "Which vehicle was serviced?" };
        if (!cost) return { intent: currentIntent, missingInfo: `What was the total cost of the service for your ${vehicleName}?` };

        // Join the raw conversation history so the user has full context in the logs
        const rawHistory = messages.filter(m => m.role === 'user').map(m => m.content).join(' | ');

        return {
            intent: currentIntent,
            payload: {
                vehicle_id: matchedVehicle,
                service_type: serviceType,
                cost,
                date: new Date().toISOString().split('T')[0],
                notes: `Auto-parsed from: "${rawHistory}"`
            }
        };
    }

    return { intent: 'unknown' };
}
