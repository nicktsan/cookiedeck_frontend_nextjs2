'use server';
import { formSchema } from '../../../components/CreateDeckForm';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DeckCreateResponseDto, DeckCreateResponseData } from './createDeckDTO';
import { ENV } from '@/env';
async function CreateDeck(formData: z.infer<typeof formSchema>): Promise<DeckCreateResponseDto> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(); //Check if there is a valid session
  if (!user) {
    return redirect('/login');
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  // console.log('session', session);
  const url = ENV.BACKEND_URL + '/deck/create';
  // Trim whitespace from all string data
  const body = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  );
  // console.log('body', body);
  let CreateDeckres: DeckCreateResponseDto = {
    statusCode: 500,
    data: {
      error: 'Default error',
    } as DeckCreateResponseData,
  };
  try {
    const { status, data } = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      // console.log('CreateDeck data:', data);
      CreateDeckres = {
        statusCode: status,
        data: data as DeckCreateResponseData,
      };
    }
    // console.log('CreateDeckres:', CreateDeckres
  } catch (error) {
    const { response, status } = error as AxiosError;
    // console.log('Error occured during deck creation: ', errResp);
    CreateDeckres = {
      statusCode: response!.status,
      data: response?.data as DeckCreateResponseData,
    };
  }
  // console.log('CreateDeckres:', CreateDeckres);
  return CreateDeckres;
}

export { CreateDeck };
