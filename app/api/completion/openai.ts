import { openai } from "@/app/openai";
import { OpenAIRequest, OpenAIResponse } from "@/app/types/openai";



// متد برای ایجاد Chat Completion
export const createCompletion = async (request: OpenAIRequest): Promise<OpenAIResponse> => {
  try {
    // ارسال درخواست به OpenAI API
    const response = await openai.chat.completions.create(request);
    return response;
  } catch (error: any) {
    console.error("Error in createCompletion:", error.message);
    throw error;
  }
};
