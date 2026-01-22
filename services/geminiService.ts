
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { VideoFile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVideoFolder = async (files: VideoFile[]): Promise<AnalysisResult> => {
  const fileListString = files.map(f => `- ${f.name} (${f.type}): ${f.notes}`).join('\n');

  const prompt = `
    Analyze this list of video files from a Google Drive folder. 
    The folder is titled "final video for social media" and focus on Egyptian tourism.
    
    Files:
    ${fileListString}
    
    Task:
    1. Summarize the overall content.
    2. Identify major content themes.
    3. Suggest a social media distribution strategy.
    4. Recommend the "Best AI Smart" tools for editing.
    
    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          contentThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedTools: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                useCase: { type: Type.STRING }
              },
              required: ["name", "description", "useCase"]
            }
          },
          socialMediaStrategy: { type: Type.STRING }
        },
        required: ["summary", "contentThemes", "recommendedTools", "socialMediaStrategy"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const createFolderChat = (files: VideoFile[]): Chat => {
  const fileListString = files.map(f => `- ${f.name}: ${f.notes}`).join('\n');
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a video production expert. You are analyzing a Google Drive folder for a client. 
      The files are:
      ${fileListString}
      
      Answer questions about these videos, suggest titles, script ideas, and which AI tools would be best for specific clips.
      Respond in the language the user uses (Arabic or English). Be concise and professional.`
    }
  });
};
