import { NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userMessages = (body?.messages ?? []) as { role: string; content: string }[]
    const language = (body?.language ?? "en") as "en" | "hi"

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing GROQ_API_KEY. Set it in your environment." },
        { status: 500 },
      )
    }

    const systemPrompt =
      language === "hi"
        ? "आप एक कृषि विशेषज्ञ सहायक हैं। NDVI, फसल तनाव, मौसम और मिट्टी के संदर्भ में संक्षेप और व्यावहारिक सलाह दें।"
        : "You are an agriculture expert assistant. Provide concise, practical advice grounded in NDVI, crop stress, weather, and soil context."

    const model = process.env.GROQ_MODEL || "llama3-8b-8192"

    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...userMessages,
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: `Groq error: ${resp.status} ${text}` }, { status: 502 })
    }

    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content ?? ""
    return NextResponse.json({ message: content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
