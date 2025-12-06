import { NextRequest, NextResponse } from "next/server";
import {
  chatWithGrok,
  generateVehicleDescription,
  estimateVehiclePrice,
  sellerAssistant,
} from "@/app/lib/grok";

/**
 * POST /api/v1/ai
 * Route pour interagir avec Grok AI via OpenRouter
 *
 * Body:
 * - action: "chat" | "description" | "estimate" | "assistant"
 * - Pour "chat": messages (array de {role, content})
 * - Pour "description": vehicle (objet avec brand, model, year, etc.)
 * - Pour "estimate": vehicle (objet avec brand, model, year, mileage, etc.)
 * - Pour "assistant": question (string)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Le champ 'action' est requis" },
        { status: 400 }
      );
    }

    let result: string;

    switch (action) {
      case "chat":
        if (!body.messages || !Array.isArray(body.messages)) {
          return NextResponse.json(
            { error: "Le champ 'messages' est requis pour l'action 'chat'" },
            { status: 400 }
          );
        }
        result = await chatWithGrok(body.messages, body.systemPrompt);
        break;

      case "description":
        if (!body.vehicle) {
          return NextResponse.json(
            { error: "Le champ 'vehicle' est requis pour l'action 'description'" },
            { status: 400 }
          );
        }
        result = await generateVehicleDescription(body.vehicle);
        break;

      case "estimate":
        if (!body.vehicle) {
          return NextResponse.json(
            { error: "Le champ 'vehicle' est requis pour l'action 'estimate'" },
            { status: 400 }
          );
        }
        result = await estimateVehiclePrice(body.vehicle);
        break;

      case "assistant":
        if (!body.question) {
          return NextResponse.json(
            { error: "Le champ 'question' est requis pour l'action 'assistant'" },
            { status: 400 }
          );
        }
        result = await sellerAssistant(body.question);
        break;

      default:
        return NextResponse.json(
          {
            error: `Action '${action}' non reconnue. Actions disponibles: chat, description, estimate, assistant`,
          },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, response: result });
  } catch (error) {
    console.error("Erreur API AI:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la communication avec l'IA",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/ai
 * Retourne les informations sur l'API AI
 */
export async function GET() {
  return NextResponse.json({
    name: "API Groq AI",
    description: "Interface avec Groq AI (ultra-rapide) via OpenRouter",
    actions: [
      {
        name: "chat",
        description: "Chat libre avec Grok AI",
        params: {
          messages: "Array de {role: 'user'|'assistant'|'system', content: string}",
          systemPrompt: "(optionnel) Prompt système",
        },
      },
      {
        name: "description",
        description: "Génère une description commerciale pour un véhicule",
        params: {
          vehicle: "{brand, model, year, mileage?, fuelType?, transmission?}",
        },
      },
      {
        name: "estimate",
        description: "Estime le prix d'un véhicule",
        params: {
          vehicle: "{brand, model, year, mileage, condition?}",
        },
      },
      {
        name: "assistant",
        description: "Assistant pour les vendeurs",
        params: {
          question: "string",
        },
      },
    ],
  });
}

