'use server'
import { z } from 'zod';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

async function MakeApiRequest<TRequest extends z.ZodType, TResponse extends z.ZodType>({
  url,
  method,
  requestSchema,
  responseSchema,
  data
}: {
  url: string,
  method: Method,
  requestSchema: TRequest,
  responseSchema: TResponse,
  data: z.infer<TRequest>
}): Promise<z.infer<TResponse>> {
  const supabase = createClient();
  if (method !== "GET") {
    const {
      data: { user },
    } = await supabase.auth.getUser(); //Check if there is a valid session
    if (!user) {
      return redirect("/login");
    }
  }
  const { data: { session } } = await supabase.auth.getSession();

  // Trim whitespace from all string data
  const trimmedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );
  const validData = requestSchema.parse(trimmedData);

  let apiResponse: z.infer<TResponse> = {
    statusCode: 500,
    data: {
      error: 'Default error'
    }
  } as z.infer<TResponse>;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const config = {
      method,
      url,
      headers,
      ...(method === 'GET' ? { params: validData } : { data: validData })
    };

    const res = await axios(config);

    if (res.data) {
      apiResponse = responseSchema.parse({
        statusCode: res.status,
        data: res.data
      });
    }
  } catch (error) {
    const { response } = error as AxiosError;
    apiResponse = responseSchema.parse({
      statusCode: response?.status || 500,
      data: response?.data || { error: 'An unexpected error occurred' }
    });
  }

  return apiResponse;
}

// Example usage for different HTTP methods:

// async function FindDeckByCreatorId(params: z.infer<typeof IDeckFindRequestByCreatorIdSchema>) {
//   const url = process.env.BACKEND_URL + '/deck/find/bycreatorid';
//   return MakeApiRequest({
//     url,
//     method: 'GET',
//     requestSchema: IDeckFindRequestByCreatorIdSchema,
//     responseSchema: IDeckFindResponseByCreatorIdSchema,
//     data: params
//   });
// }

// async function CreateDeck(data: z.infer<typeof CreateDeckRequestDto>) {
//   const url = process.env.BACKEND_URL + '/deck/create';
//   return MakeApiRequest({
//     url,
//     method: 'POST',
//     requestSchema: CreateDeckRequestDto,
//     responseSchema: CreateDeckResponseDto,
//     data
//   });
// }

// async function UpdateDeck(data: z.infer<typeof UpdateDeckRequestDto>) {
//   const url = process.env.BACKEND_URL + '/deck/update';
//   return MakeApiRequest({
//     url,
//     method: 'PATCH',
//     requestSchema: UpdateDeckRequestDto,
//     responseSchema: UpdateDeckResponseDto,
//     data
//   });
// }

// async function DeleteDeck(data: z.infer<typeof DeleteDeckRequestDto>) {
//   const url = process.env.BACKEND_URL + '/deck/delete';
//   return MakeApiRequest({
//     url,
//     method: 'DELETE',
//     requestSchema: DeleteDeckRequestDto,
//     responseSchema: DeleteDeckResponseDto,
//     data
//   });
// }

export { MakeApiRequest };