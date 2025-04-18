import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/index.mjs';
type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// ✅ Initialize OpenAI SDK v4
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Required fallback for TS
});

const instructionMessage: ChatCompletionMessageParam ={ 
  role :'system',
  content : `You are a code generater. You will be given a prompt and you will generate the code for that prompt. You will only respond with the code and nothing else. use code commemts for explanation of the code`
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages }: { messages: ChatMessage[] } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages :[instructionMessage, ...messages],
    }); 

    return NextResponse.json(response.choices[0].message);
  } catch (error:any) {
    console.error("[CODE_ERROR]", error);

    if (error.status === 429 || error.code === "insufficient_quota") {
      return new NextResponse("Rate limit or quota exceeded", { status: 429 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
