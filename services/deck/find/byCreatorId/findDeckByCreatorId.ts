'use server';
import {
  DeckFindRequestByCreatorIdSchema,
  DeckFindResponseByCreatorIdSchema,
  DeckFindResponseByCreatorIdDataSchema,
} from './findDeckByCreatorIdSchema';
import { z } from 'zod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ENV } from '@/env';
async function FindDeckByCreatorId(
  params: z.infer<typeof DeckFindRequestByCreatorIdSchema>,
): Promise<z.infer<typeof DeckFindResponseByCreatorIdSchema>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  // console.log('session', session);
  const url = ENV.BACKEND_URL + '/deck/find/bycreatorid';
  // Trim whitespace from all string data
  const trimmedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  );
  const validParams = DeckFindRequestByCreatorIdSchema.parse(trimmedParams);
  // console.log('validParams', validParams);
  let FindDeckRes: z.infer<typeof DeckFindResponseByCreatorIdSchema> = {
    statusCode: 500,
    data: {
      error: 'Default error',
    } as z.infer<typeof DeckFindResponseByCreatorIdDataSchema>,
  };
  try {
    let res: AxiosResponse;
    if (session) {
      res = await axios.get(url, {
        params: validParams,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      res = await axios.get(url, {
        params: validParams,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    // const { status, data } =
    if (res.data) {
      // console.log('CreateDeck data:', data);
      FindDeckRes = {
        statusCode: res.status,
        data: res.data as z.infer<typeof DeckFindResponseByCreatorIdDataSchema>,
      };
    }
    // console.log('FindDeckRes:', FindDeckRes
  } catch (error) {
    const { response, status } = error as AxiosError;
    // console.log('Error occured during deck creation: ', errResp);
    FindDeckRes = {
      statusCode: response!.status,
      data: response?.data as z.infer<typeof DeckFindResponseByCreatorIdDataSchema>,
    };
  }
  // console.log('FindDeckRes:', FindDeckRes);
  return FindDeckRes;
}

export { FindDeckByCreatorId };
