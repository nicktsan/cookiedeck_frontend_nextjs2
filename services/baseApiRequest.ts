'use server';
import { z } from 'zod';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { createClient } from '@/utils/supabase/server';
import { ErrorResponseDTO, ErrorResponseSchema } from '@/utils/error.schema';

async function MakeApiRequest<TRequest extends z.ZodType, TResponse extends z.ZodType>({
  url,
  method,
  requestSchema,
  responseSchema,
  data,
}: {
  url: string;
  method: Method;
  requestSchema: TRequest;
  responseSchema: TResponse;
  data: z.infer<TRequest>;
}): Promise<z.infer<TResponse> | ErrorResponseDTO> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Trim whitespace from all string data
  const trimmedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  );
  const validData = requestSchema.parse(trimmedData);

  let apiResponse: z.infer<TResponse> = {
    statusCode: 500,
    data: {
      error: 'Default error',
    },
  } as z.infer<TResponse>;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const config = {
      method,
      url,
      headers,
      ...(method === 'GET' ? { params: validData } : { data: validData }),
    };
    const res = await axios(config);
    if (res.data) {
      apiResponse = responseSchema.parse({
        statusCode: res.status,
        data: res.data,
      });
    }
  } catch (error) {
    // console.log('error: ', error);
    const { response } = error as AxiosError;
    // console.log('error response data: ', response?.data);
    return ErrorResponseSchema.parse({
      statusCode: response?.status || 500,
      data: response?.data || { error: error },
    }) as ErrorResponseDTO;
  }
  return apiResponse;
}

export { MakeApiRequest };
