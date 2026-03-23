"use server";

import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/crypto";
import type { OcrExtractedData } from "@/types/ai";
import { getErrorMessage } from "@/utils/errors";

export async function extractDataFromInvoice(fileUrl: string, filePath?: string | null) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to perform OCR.");
    }

    const { data: userData } = await supabase
        .from("users")
        .select("encrypted_llm_key, encrypted_openai_key, preferred_llm_provider")
        .eq("id", user.id)
        .single();

    const hasGemini = !!userData?.encrypted_llm_key;
    const hasOpenAi = !!userData?.encrypted_openai_key;

    if (!hasGemini && !hasOpenAi) {
        throw new Error("Missing Vision-capable API Key. Please add an OpenAI or Gemini key in Profile Settings.");
    }

    let useProvider = "gemini";
    let encryptedKey = userData?.encrypted_llm_key;

    if (userData?.preferred_llm_provider === "openai" && hasOpenAi) {
        useProvider = "openai";
        encryptedKey = userData.encrypted_openai_key;
    } else if (userData?.preferred_llm_provider === "gemini" && hasGemini) {
        useProvider = "gemini";
        encryptedKey = userData.encrypted_llm_key;
    } else if (hasOpenAi) {
        useProvider = "openai";
        encryptedKey = userData.encrypted_openai_key;
    } else {
        useProvider = "gemini";
        encryptedKey = userData.encrypted_llm_key;
    }

    let apiKey = "";
    try {
        if (!encryptedKey) throw new Error("No Key");
        apiKey = decrypt(encryptedKey);
    } catch {
        throw new Error("Failed to decrypt your API key. Please re-enter it in Profile Settings.");
    }

    try {
        let dataUri = fileUrl;
        try {
            if (filePath) {
                const { data, error } = await supabase.storage.from('vehicle-documents').download(filePath);
                if (error) throw error;
                const arrayBuffer = await data.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const mimeType = data.type || "image/jpeg";
                dataUri = `data:${mimeType};base64,${base64}`;
            } else {
                const imageRes = await fetch(fileUrl);
                if (imageRes.ok) {
                    const arrayBuffer = await imageRes.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    const mimeType = imageRes.headers.get("content-type") || "image/jpeg";
                    dataUri = `data:${mimeType};base64,${base64}`;
                }
            }
        } catch (e) {
            console.error("Failed to fetch image for base64 encoding", e);
        }

        const baseUrl = useProvider === "openai" 
            ? "https://api.openai.com/v1/chat/completions"
            : "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

        const modelName = useProvider === "openai"
            ? (process.env.OPENAI_MODEL || "gpt-4o-mini")
            : (process.env.GEMINI_MODEL || "gemini-1.5-flash");

        const response = await fetch(baseUrl, {
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
                                image_url: { url: dataUri },
                            },
                        ],
                    },
                ]
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
