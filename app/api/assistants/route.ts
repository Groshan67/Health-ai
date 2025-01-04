import { openai } from "@/app/openai";
import { ins } from "@/app/api/completion/my-ins"

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: ins,
    name: "Doctor Assistant",
    model: "gpt-4o",
    tools: [
      // { type: "code_interpreter" },
      // {
      //   type: "function",
      //   function: {
      //     name: "Radiologist",
      //     description: "Diagnosis of disease in radiology images",
      //     parameters: {
      //       type: "object",
      //       properties: {
      //         location: {
      //           type: "string",
      //           description: "The world",
      //         },
      //         unit: {
      //           type: "string",
      //           enum: ["c", "f"],
      //         },
      //       },
      //       required: ["location"],
      //     },
      // },
      // },
      { type: "file_search" },
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
