"use server";

import { createClient } from "@/utils/supabase/server";

export async function extractDataFromInvoice(fileUrl: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API Key is missing. OCR cannot be performed.");
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an automotive data extraction assistant. The user will provide an image of an automotive repair invoice or receipt. 
                        Extract the details into strict JSON matching this schema:
                        {
                            "provider": "string (name of the shop)",
                            "date": "YYYY-MM-DD",
                            "total_cost": "number (the grand total)",
                            "odometer": "number or null",
                            "line_items": [
                                { "service": "string (name of the specific repair/part)", "cost": "number" }
                            ]
                        }
                        Return ONLY valid JSON. No markdown wrappings (\`\`\`json) and no conversational text.`,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "image_url",
                                image_url: { url: fileUrl },
                            },
                        ],
                    },
                ],
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI Error:", errorData);
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content.trim();

        // Safety: Strip markdown if the LLM ignored strict instructions
        let jsonStr = rawContent;
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7);
            if (jsonStr.endsWith("```")) {
                jsonStr = jsonStr.substring(0, jsonStr.length - 3);
            }
        }

        return JSON.parse(jsonStr);
    } catch (e: any) {
        console.error("OCR Extraction Failed:", e);
        throw new Error(e.message || "Failed to process the invoice.");
    }
}
