import OpenAI from "openai";

export async function GET() {
  const openai = new OpenAI();

  try {
    const response = await openai.beta.threads.create();

    console.log(response);

    return Response.json({ thread: response });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
