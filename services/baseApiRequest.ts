'use server';
import { z } from 'zod';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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
}): Promise<z.infer<TResponse>> {
  const supabase = createClient();
  if (method !== 'GET') {
    const {
      data: { user },
    } = await supabase.auth.getUser(); //Check if there is a valid session
    if (!user) {
      return redirect('/login');
    }
  }
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
      // console.log("res.data: ", res.data);
      // console.log("res.status: ", res.status);
      apiResponse = responseSchema.parse({
        statusCode: res.status,
        data: res.data,
      });
    }
  } catch (error) {
    // console.log('error: ', error);
    const { response } = error as AxiosError;
    apiResponse = responseSchema.parse({
      statusCode: response?.status || 500,
      data: response?.data || { error: error },
    });
  }

  return apiResponse;
}

export { MakeApiRequest };
