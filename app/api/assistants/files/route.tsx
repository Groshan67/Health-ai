import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

// upload file to assistant's vector store
export async function POST(request: any) {
  const formData = await request.formData(); // process file as FormData
  const file = formData.get("file"); // retrieve the single file from FormData
  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store

  // upload using the file stream
  const openaiFile = await openai.files.create({
    file: file,
    purpose: "assistants",
  });

  // add file to vector store
  const vectorStores = (openai.beta as any).vectorStores;
  await vectorStores.files.create(vectorStoreId, { file_id: openaiFile.id });

  return new Response();
}

// list files in assistant's vector store
export async function GET() {
  const vectorStores = (openai.beta as any).vectorStores;
  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
  const fileList = await vectorStores.files.list(vectorStoreId);

  const filesArray = await Promise.all(
    fileList.data.map(async (file) => {
      const fileDetails = await openai.files.retrieve(file.id);
      const vectorFileDetails = await vectorStores.files.retrieve(
        vectorStoreId,
        file.id
      );
      return {
        file_id: file.id,
        filename: fileDetails.filename,
        status: vectorFileDetails.status,
      };
    })
  );
  return Response.json(filesArray);
}

// delete file from assistant's vector store
export async function DELETE(request: any) {
  const body = await request.json();
  const fileId = body.fileId;

  const vectorStores = (openai.beta as any).vectorStores;
  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
  await vectorStores.files.del(vectorStoreId, fileId); // delete file from vector store

  return new Response();
}

/* Helper functions */

const getOrCreateVectorStore = async () => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);

  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }

  // otherwise, create a new vector store and attach it to the assistant
  const vectorStores = (openai.beta as any).vectorStores;
  const vectorStore = await vectorStores.create({
    name: "sample-assistant-vector-store",
  });

  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });

  return vectorStore.id;
};
