import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const file = form.get("image");
    const context = String(form.get("context") ?? "").slice(0, 500);

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 413 });
    }

    const data = Buffer.from(await file.arrayBuffer()).toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    parts: [
                        { inlineData: { data, mimeType: file.type } },
                        {
                            text: `Write alt text for this image following WCAG 2.1 and W3C alt decision tree guidance.
- Describe what matters, not everything. Aim for under 125 characters.
- Don't start with "image of" or "picture of".
- Transcribe any text in the image that conveys meaning.
- If the image is purely decorative, return an empty string for altText.
- For charts, state the key takeaway.
${context ? `Page context: ${context}` : ""}
Return JSON with 'altText' and 'category' (e.g. Photograph, Icon, Chart, UI Element, Decorative).`,
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        altText: { type: Type.STRING },
                        category: { type: Type.STRING },
                    },
                    required: ["altText", "category"],
                },
            },
        });

        const parsed = JSON.parse(response.text || "{}");
        return NextResponse.json({
            altText: typeof parsed.altText === "string" ? parsed.altText : "",
            category: String(parsed.category || "General"),
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Could not generate alt text." }, { status: 500 });
    }
}