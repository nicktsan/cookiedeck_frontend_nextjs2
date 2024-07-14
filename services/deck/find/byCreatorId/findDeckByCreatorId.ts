'use server'
import { IDeckFindRequestByCreatorIdSchema, IDeckFindResponseByCreatorIdSchema, IDeckFindResponseByCreatorIdDataSchema } from './findDeckByCreatorIdSchema';
import { z } from 'zod';
import axios, { AxiosError, AxiosResponse} from 'axios';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
async function FindDeckByCreatorId(params: z.infer<typeof IDeckFindRequestByCreatorIdSchema>): Promise<z.infer<typeof IDeckFindResponseByCreatorIdSchema>> {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();
  // console.log('session', session);
  const url = process.env.BACKEND_URL + '/deck/find/bycreatorid'  
  // Trim whitespace from all string data
  const trimmedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );
  const validParams = IDeckFindRequestByCreatorIdSchema.parse(trimmedParams);
  // console.log('validParams', validParams);
  let FindDeckRes: z.infer<typeof IDeckFindResponseByCreatorIdSchema> = {
    statusCode: 500,
    data: {
      error: 'Default error'
    } as z.infer<typeof IDeckFindResponseByCreatorIdDataSchema>
  };
  try {
    let res: AxiosResponse;
    if (session) {
      res = await axios.get(url, {
        params: validParams,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
    } else {
      res = await axios.get(url, {
        params: validParams,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    // const { status, data } = 
    if (res.data) {
      // console.log('CreateDeck data:', data);
      FindDeckRes =  {
        statusCode: res.status,
        data: res.data as z.infer<typeof IDeckFindResponseByCreatorIdDataSchema>,
      }
    }
    // console.log('FindDeckRes:', FindDeckRes
  } catch (error) {
    const { response, status } = error as AxiosError;
    // console.log('Error occured during deck creation: ', errResp);
    FindDeckRes = {
      statusCode: response!.status,
      data: response?.data as z.infer<typeof IDeckFindResponseByCreatorIdDataSchema>,
    }
  }
  // console.log('FindDeckRes:', FindDeckRes);
  return FindDeckRes;
}

export { FindDeckByCreatorId }