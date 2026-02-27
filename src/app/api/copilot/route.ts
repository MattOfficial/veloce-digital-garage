import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/crypto";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return Response.json({ role: "assistant", content: "You must be logged in to use Veloce Copilot." });
        }

        const { data: userData } = await supabase
            .from("users")
            .select("encrypted_llm_key")
            .eq("id", user.id)
            .single();

        if (!userData?.encrypted_llm_key) {
            return Response.json({ role: "assistant", content: "To use Veloce Copilot, please provide your Gemini API key in your Profile Settings." });
        }

        let apiKey = "";
        try {
            apiKey = decrypt(userData.encrypted_llm_key);
        } catch (e) {
            return Response.json({ role: "assistant", content: "Failed to decrypt your API key. Please re-enter it in Profile Settings." });
        }

        const ai = new GoogleGenAI({ apiKey });

        const { messages, vehicles } = await req.json();

        // System instructions to guide the Orchestrator
        const systemInstruction = `
            You are "Veloce Copilot", an AI assistant built into the Veloce Tracker app.
            Your job is to help users track their vehicle expenses, fuel, and maintenance.
            You have access to tools to log data on the user's behalf.
            
            Current User Garage:
            ${JSON.stringify(vehicles, null, 2)}
            
            STRICT GUARDRAILS & RULES:
            1. DOMAIN RESTRICTION: You are explicitly restricted to topics regarding vehicles, cars, motorcycles, automotive maintenance, fuel efficiency, and the user's garage. 
            2. OUT OF SCOPE REJECTION: If the user asks you to write code (e.g., Python, JavaScript), solve math problems, write essays, or act as a general-purpose AI, you MUST politely refuse. Example response: "I am specialized for the Veloce Tracker application. I can only assist you with managing your vehicles, fuel logs, and maintenance."
            3. FUEL LOGGING: If the user asks to log fuel, you MUST use the log_fuel_draft tool. However, you MUST NOT use the tool if the user hasn't provided the Cost, Volume (liters/gallons), and Odometer reading. If they are missing, ask them explicitly.
            4. VEHICLE RESOLUTION: If the user refers to a vehicle by "nickname" or "make" and it's unambiguous, map it to the correct vehicle_id. If it IS ambiguous (e.g. they say "Honda" and have two Hondas), ask them to clarify before calling the tool.
            5. DOCUMENT UPLOADS: If the user attaches an invoice/receipt, analyze it thoroughly. Extract the total cost, date, and service provider. ALSO, extract ALL SPECIFIC line items (parts and labor) and append them into the 'notes' parameter as a bulleted list. Always include the receipt_url in your tool call if one was provided in the context. 
            6. TONE: For general chat within the automotive domain, be helpful, concise, and friendly.
        `;

        // Map the chat history to the format Google GenAI expects
        const contents = await Promise.all(messages.map(async (m: any) => {
            const parts: any[] = [{ text: m.content }];

            if (m.attachments && Array.isArray(m.attachments)) {
                // Process all attachments concurrently
                await Promise.all(m.attachments.map(async (att: any) => {
                    if (!att.url) return;
                    try {
                        const fileRes = await fetch(att.url);
                        const arrayBuffer = await fileRes.arrayBuffer();
                        const base64Data = Buffer.from(arrayBuffer).toString('base64');
                        parts.push({
                            inlineData: {
                                data: base64Data,
                                mimeType: att.mimeType || "image/jpeg"
                            }
                        });
                    } catch (err) {
                        console.error("Failed to fetch attachment:", err);
                    }
                }));
            }

            return {
                role: m.role === 'user' ? 'user' : 'model',
                parts
            };
        }));

        // Call the configured Gemini model (defaults to 1.5 Flash if not specified)
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2, // Keep it relatively deterministic for tool calling
                tools: [{
                    functionDeclarations: [
                        {
                            name: "log_fuel_draft",
                            description: "Drafts a new fuel log entry for the user to confirm. Use this when the user says they refuelled, got gas, petrol, petrol pump, filled the tank etc.",
                            parameters: {
                                type: Type.OBJECT,
                                properties: {
                                    vehicle_id: { type: Type.STRING, description: "The UUID of the vehicle from the user's garage context." },
                                    cost: { type: Type.NUMBER, description: "The total cost of the fuel." },
                                    volume: { type: Type.NUMBER, description: "The amount of fuel added (e.g. liters or gallons)." },
                                    odometer: { type: Type.NUMBER, description: "The current odometer reading on the dashboard." },
                                    date: { type: Type.STRING, description: "The date of refueling in YYYY-MM-DD format. Default to today if not specified." }
                                },
                                required: ["vehicle_id", "cost", "volume", "odometer"]
                            }
                        },
                        {
                            name: "log_maintenance_draft",
                            description: "Drafts a new maintenance log entry for the user to confirm. Use this when the user says they got an oil change, tire rotation, new brakes, repaired the engine, etc.",
                            parameters: {
                                type: Type.OBJECT,
                                properties: {
                                    vehicle_id: { type: Type.STRING, description: "The UUID of the vehicle from the user's garage context." },
                                    service_type: { type: Type.STRING, description: "A short label for the service performed (e.g. 'Oil Change', 'New Tires')." },
                                    cost: { type: Type.NUMBER, description: "The total cost of the service." },
                                    notes: { type: Type.STRING, description: "Any extra details the user mentioned about the repair. If parsing a receipt, list the exact line items here." },
                                    date: { type: Type.STRING, description: "The date of the service in YYYY-MM-DD format. Default to today if not specified." },
                                    receipt_url: { type: Type.STRING, description: "The Supabase Storage URL of the receipt/invoice if one was provided in the message attachment. If multiple were provided, provide the primary one here." }
                                },
                                required: ["vehicle_id", "service_type", "cost"]
                            }
                        }
                    ]
                }]
            }
        });


        // Check if the model decided to call a function
        const functionCall = response.functionCalls?.[0];

        if (functionCall) {
            // The AI wants to execute an action
            return Response.json({
                role: "assistant",
                content: "I've prepared that log for you. Please review and confirm.",
                pendingAction: {
                    type: functionCall.name,
                    payload: functionCall.args
                }
            });
        }

        // Otherwise, it's just a conversational response
        return Response.json({
            role: "assistant",
            content: response.text
        });

    } catch (e: any) {
        console.error("Copilot AI Error:", e);
        return Response.json({ error: e.message || "Failed to communicate with Copilot." }, { status: 500 });
    }
}
