import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `You are a futuristic UX designer and technology forecaster. Your task is to take a user flow from today and reimagine it in the year 2030. Consider emerging technologies like AI, AR/VR, brain-computer interfaces, ambient computing, and other innovations that might transform how users interact with digital products.

Generate a detailed, creative, and plausible vision of how this user flow might work in 2030. Be specific about the technologies, interactions, and experiences involved. Make it inspiring yet grounded in realistic technological progression.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const generatedText = message.content[0].text;

    return NextResponse.json({ result: generatedText });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

