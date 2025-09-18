import { GoogleGenAI, Type } from "@google/genai";
import { PlayerProfile, Mission } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const missionSchema = {
    type: Type.OBJECT,
    properties: {
        mission_name: { type: Type.STRING, description: "The official name of the mission." },
        objective: { type: Type.STRING, description: "A clear, concise objective for the player." },
        mechanics: { type: Type.STRING, description: "How the player interacts or plays the mission." },
        reward: { type: Type.STRING, description: "The in-game reward for completion (e.g., '50 Stardust, unlocks a new star')." },
        co_pilot_message: { type: Type.STRING, description: "An optional, fun, empathetic message from the co-pilot related to this mission.", optional: true },
    },
    required: ['mission_name', 'objective', 'mechanics', 'reward']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        suggested_missions: {
            type: Type.ARRAY,
            items: missionSchema,
            description: "An array of 3-5 playable mission objects.",
            optional: true
        },
        co_pilot_message: { type: Type.STRING, description: "A general playful, empathetic, space-themed message from the co-pilot based on player mood.", optional: true },
        distress_detected: { type: Type.BOOLEAN, description: "True if the player's mood log indicates significant distress.", optional: true },
        support_hint: { type: Type.STRING, description: "A subtle in-game hint for support if distress is detected.", optional: true },
    },
};

const generateSystemInstruction = (profile: PlayerProfile): string => {
    return `You are a mission generator for a space-themed gamified wellness game called Mind Galaxy.
The player is Star Captain ${profile.name}, flying the spaceship ${profile.spaceship} with their ${profile.coPilot} co-pilot.
Your tone must be playful, immersive, space-themed, and game-focused.
Your task is to generate 3-5 playable missions based on the user's mood log.
Your entire response MUST be a single JSON object matching the provided schema. Do not output markdown.

Generate a variety of missions from the following categories, using the specified JSON format. Ensure you include the playable "Quick Reflex: Asteroid Field" and "Memory Constellations" missions often.

1.  **Positive Psychology Missions:** (Focus on gratitude, strengths, small wins)
    -   Example:
        {
          "mission_name": "Star Log: The Bright Spot",
          "objective": "Log one thing that made you smile today.",
          "mechanics": "Type a short description of a positive moment. The memory will be stored as a new shining star on your galaxy map.",
          "reward": "A new 'Memory Star' added to your galaxy.",
          "co_pilot_message": "Excellent find, Captain! That memory is now a beacon in our sector."
        }

2.  **Creative Expression Missions:** (Doodling, naming things, using emojis)
    -   Example:
        {
          "mission_name": "Constellation Creator",
          "objective": "Draw a constellation that represents your current feeling.",
          "mechanics": "Use your finger or mouse to connect stars on a mini-map, forming a new constellation. Give it a unique name.",
          "reward": "New Constellation discovered, 20 Stardust.",
          "co_pilot_message": "A new constellation is born! A beautiful addition to our galactic charts."
        }

3.  **Mind Games (Fun & Engaging):** (Puzzles, reflex games, memory challenges)
    -   **Playable Example 1:**
        {
          "mission_name": "Quick Reflex: Asteroid Field",
          "objective": "Shoot the incoming 'stress' asteroids before they hit your ship.",
          "mechanics": "Tap or click on the fast-moving asteroid graphics on the screen. Don't hit the friendly ships!",
          "reward": "25 Stardust, +1 Shield Integrity.",
          "co_pilot_message": "Incredible reflexes, Captain! The flight path is clear."
        }
    -   **Playable Example 2:**
         {
          "mission_name": "Memory Constellations",
          "objective": "Memorize and repeat the light patterns to unlock a new star.",
          "mechanics": "Watch the sequence of stars light up, then click them in the same order. The sequence gets longer with each level.",
          "reward": "30 Stardust, +1 Focus Point.",
          "co_pilot_message": "Your focus is stellar, Captain! A new constellation is charted."
        }

4.  **Community Missions (Optional, Stigma-Free):** (Safe, anonymous, positive interactions)
    -   Example:
        {
          "mission_name": "Signal Boost",
          "objective": "Send a burst of positive stardust energy to another captain anonymously.",
          "mechanics": "Press and hold a button to charge up a positive energy wave, then release to send it out into the galaxy. You'll see it travel to another random player's system.",
          "reward": "Good Karma Badge (Tier 1).",
          "co_pilot_message": "Signal sent! Your positive energy is now traveling at light speed."
        }`;
};

const mockResponses: { [key: string]: any } = {
    onboarding: {
        onboarding_message: "Greetings, Captain! I am your co-pilot. The Starblazer is powered up and ready to explore the Mind Galaxy. Let's navigate the cosmos of your emotions together!"
    },
    daily: {
        daily_reward: "Welcome back, Captain! Your presence illuminates the cosmos. You've earned 10 Stardust! 'The journey of a thousand light-years begins with a single thought.'"
    },
    mood: {
        co_pilot_message: "Acknowledged, Captain. Engine efficiency is low, matching your energy levels. A short mission could recharge our power cells and lift our spirits. Ready to plot a course?",
        distress_detected: true,
        support_hint: "The cosmos are vast and sometimes lonely. Remember, the Galactic Support Network is always open for a comms link if you need it.",
        suggested_missions: [
             {
                mission_name: "Memory Constellations",
                objective: "Memorize and repeat the light patterns to unlock a new star.",
                mechanics: "Watch the sequence of stars light up, then click them in the same order.",
                reward: "30 Stardust.",
                co_pilot_message: "Your focus is stellar, Captain!"
            },
            {
                mission_name: "Quick Reflex: Asteroid Field",
                objective: "Shoot the incoming 'stress' asteroids.",
                mechanics: "Tap on the moving asteroid graphics to blast them away.",
                reward: "25 Stardust.",
                co_pilot_message: "Nice shooting, Captain! Path is clear."
            },
            {
                mission_name: "Signal Boost",
                objective: "Send positive energy to another captain anonymously.",
                mechanics: "Press a button to send a wave of stardust out into the galaxy.",
                reward: "Good Karma Badge.",
            },
        ],
    }
};


const generateGameContent = async (profile: PlayerProfile, prompt: string): Promise<any> => {
    if (!ai) {
        console.log("Using mock response for prompt:", prompt);
        if (prompt.includes("onboarding_message")) return mockResponses.onboarding;
        if (prompt.includes("daily_reward")) return mockResponses.daily;
        return mockResponses.mood;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction: generateSystemInstruction(profile),
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        // Fallback to mock on API error
        console.log("Falling back to mock response due to API error.");
        if (prompt.includes("onboarding_message")) return mockResponses.onboarding;
        if (prompt.includes("daily_reward")) return mockResponses.daily;
        return mockResponses.mood;
    }
};

export const getOnboardingMessage = (profile: PlayerProfile) => {
    const prompt = `Generate an onboarding_message for the player.`;
    return generateGameContent(profile, prompt);
};

export const getDailyReward = (profile: PlayerProfile) => {
    const prompt = `Generate a daily_reward for the player logging in.`;
    return generateGameContent(profile, prompt);
};

export const getMissionsAndMessages = (profile: PlayerProfile, mood: string) => {
    const prompt = `The player's mood is: "${mood}".
Generate suggested_missions, a co_pilot_message, distress_detected, and a support_hint if needed.`;
    return generateGameContent(profile, prompt);
};