"use server";

import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/crypto";
import type { OcrExtractedData } from "@/types/ai";
import { getErrorMessage } from "@/utils/errors";

export async function extractDataFromInvoice(fileUrl: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to perform OCR.");
    }

    const { data: userData } = await supabase
        .from("users")
        .select("encrypted_llm_key")
        .eq("id", user.id)
        .single();

    if (!userData?.encrypted_llm_key) {
        throw new Error("Missing Gemini API Key. Please add it in your Profile Settings.");
    }

    let apiKey = "";
    try {
        apiKey = decrypt(userData.encrypted_llm_key);
    } catch {
        throw new Error("Failed to decrypt your API key. Please re-enter it in Profile Settings.");
    }

    try {
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: modelName,
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

        const data = await response.json() as {
            choices?: Array<{
                message?: {
                    content?: string;
                };
            }>;
        };
        const rawContent = data.choices?.[0]?.message?.content?.trim();

        if (!rawContent) {
            throw new Error("The OCR provider returned an empty response.");
        }

        // Safety: Strip markdown if the LLM ignored strict instructions
        let jsonStr = rawContent;
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7);
            if (jsonStr.endsWith("```")) {
                jsonStr = jsonStr.substring(0, jsonStr.length - 3);
            }
        }

        return JSON.parse(jsonStr) as OcrExtractedData;
    } catch (error: unknown) {
        console.error("OCR Extraction Failed:", error);
        throw new Error(getErrorMessage(error, "Failed to process the invoice."));
    }
}
