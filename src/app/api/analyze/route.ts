import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});



export async function POST(req: Request) {
  try {
    const { expression } = await req.json();

    if (!expression || typeof expression !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing expression' }, { status: 400 });
    }

    const prompt = `Explain this math expression in simple terms: ${expression}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4', 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const aiText = response.choices[0]?.message?.content;

    return NextResponse.json({ explanation: aiText });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to get AI explanation' }, { status: 500 });
  }
}
