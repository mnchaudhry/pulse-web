import { GoogleGenAI } from '@google/genai'

// Server-only Gemini client. GEMINI_API_KEY never ships to the browser or the
// extension — the bot is only reachable through pulse-web's server (tech-stack §6).
let client: GoogleGenAI | undefined

export const getGeminiClient = () => {
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
  return client
}

// Default model for bot turns. Latest Gemini flash tier — fast + tool-calling.
export const GEMINI_MODEL = 'gemini-2.5-flash'
