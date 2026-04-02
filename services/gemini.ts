"use server";

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function remediateComponent(code: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                text: `You are an expert in Web Accessibility (WCAG 2.1). 
        Analyze the following React component code for accessibility violations.
        Provide a JSON response with:
        1. 'violations': An array of strings describing the issues found.
        2. 'fixedCode': The corrected React component code.
        3. 'explanation': A brief summary of the changes made.
        
        Focus on:
        - Missing aria-labels
        - Incorrect tabIndex
        - Heading level hierarchy
        - Form label associations
        - Semantic HTML usage
        
        Code to analyze:
        ${code}`,
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    violations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    fixedCode: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                },
                required: ["violations", "fixedCode", "explanation"],
            },
        },
    });

    return JSON.parse(response.text || "{}");
}

export async function generateAltText(base64Image: string, mimeType: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                parts: [
                    {
                        inlineData: {
                            data: base64Image.split(",")[1],
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: "Describe this image for an alt text attribute. Be concise but descriptive. Provide context if it looks like a UI element or a meaningful photo.",
                    },
                ],
            },
        ],
    });

    return response.text;
}

export async function suggestContrastColor(fg: string, bg: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                text: `The foreground color ${fg} and background color ${bg} fail WCAG contrast ratios. 
        Suggest a new foreground color that is visually similar to ${fg} but passes WCAG AA (4.5:1) or AAA (7:1) contrast against ${bg}.
        Return a JSON object with:
        1. 'suggestedColor': The hex code of the new color.
        2. 'ratio': The new contrast ratio.
        3. 'explanation': Why this color was chosen.`,
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedColor: { type: Type.STRING },
                    ratio: { type: Type.NUMBER },
                    explanation: { type: Type.STRING },
                },
                required: ["suggestedColor", "ratio", "explanation"],
            },
        },
    });

    return JSON.parse(response.text || "{}");
}
