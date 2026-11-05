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
    const cleanBase64 = base64Image.includes(",")
        ? base64Image.split(",")[1]
        : base64Image;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                parts: [
                    {
                        inlineData: {
                            data: cleanBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: `Analyze this image and generate context-aware alt text for accessibility (WCAG 2.1). 
Provide a JSON response with:
1. 'altText': A concise, descriptive, screen-reader friendly alt text string.
2. 'category': The type of image detected (e.g., 'UI Element', 'Photograph', 'Icon', 'Chart').`,
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
    return {
        altText: String(parsed.altText || "Description unavailable."),
        category: String(parsed.category || "General"),
    };
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
