import OpenAI from "openai";

// Configuration du client OpenAI pour utiliser OpenRouter avec Groq
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "VTC Project",
  },
});

// Modèles Groq disponibles sur OpenRouter (ultra-rapides)
// - "meta-llama/llama-3.3-70b-instruct" (puissant)
// - "meta-llama/llama-3.1-8b-instant" (rapide)
// - "mistralai/mixtral-8x7b-instruct" (bon équilibre)
const GROQ_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Envoie un message à Grok AI et retourne la réponse
 */
export async function chatWithGrok(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const allMessages: ChatMessage[] = [];

  // Ajouter le prompt système si fourni
  if (systemPrompt) {
    allMessages.push({ role: "system", content: systemPrompt });
  }

  allMessages.push(...messages);

  const response = await openrouter.chat.completions.create({
    model: GROQ_MODEL,
    messages: allMessages,
  });

  return response.choices[0]?.message?.content || "Aucune réponse générée.";
}

/**
 * Génère une description de véhicule basée sur ses caractéristiques
 */
export async function generateVehicleDescription(vehicle: {
  brand: string;
  model: string;
  year: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
}): Promise<string> {
  const prompt = `Génère une description commerciale attrayante pour ce véhicule :
- Marque : ${vehicle.brand}
- Modèle : ${vehicle.model}
- Année : ${vehicle.year}
${vehicle.mileage ? `- Kilométrage : ${vehicle.mileage} km` : ""}
${vehicle.fuelType ? `- Carburant : ${vehicle.fuelType}` : ""}
${vehicle.transmission ? `- Transmission : ${vehicle.transmission}` : ""}

La description doit être professionnelle, en français, et mettre en valeur les points forts du véhicule. Maximum 150 mots.`;

  return chatWithGrok([{ role: "user", content: prompt }]);
}

/**
 * Estime le prix d'un véhicule basé sur ses caractéristiques
 */
export async function estimateVehiclePrice(vehicle: {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition?: string;
}): Promise<string> {
  const prompt = `En tant qu'expert automobile, estime le prix de ce véhicule sur le marché français :
- Marque : ${vehicle.brand}
- Modèle : ${vehicle.model}
- Année : ${vehicle.year}
- Kilométrage : ${vehicle.mileage} km
${vehicle.condition ? `- État : ${vehicle.condition}` : ""}

Donne une fourchette de prix réaliste en euros avec une brève justification.`;

  return chatWithGrok([{ role: "user", content: prompt }]);
}

/**
 * Assistant chatbot pour les vendeurs
 */
export async function sellerAssistant(question: string): Promise<string> {
  const systemPrompt = `Tu es un assistant spécialisé dans la vente automobile. 
Tu aides les vendeurs avec leurs questions sur :
- Les stratégies de vente
- Les négociations avec les clients
- Les tendances du marché automobile
- Les conseils pour présenter les véhicules
- Les aspects juridiques de la vente automobile en France

Réponds de manière professionnelle et concise en français.`;

  return chatWithGrok([{ role: "user", content: question }], systemPrompt);
}

