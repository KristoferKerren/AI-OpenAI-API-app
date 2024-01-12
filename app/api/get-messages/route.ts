import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get("threadId");

  if (!threadId)
    return Response.json({ error: "No thread id provided" }, { status: 400 });

  const openai = new OpenAI();

  try {
    const messages = await openai.beta.threads.messages.list(threadId);

    console.log({ messages: messages });

    return Response.json({ messages: messages });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
