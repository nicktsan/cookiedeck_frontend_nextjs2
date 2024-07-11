'use server'
import { formSchema } from '../../components/CreateDeckForm';
import { z } from 'zod';
import axios, { AxiosResponse, AxiosError} from 'axios';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { IDeckCreateResponseDto, IDeckCreateResponseData } from './createDeckDTO'
async function CreateDeck(formData: z.infer<typeof formSchema>): Promise<IDeckCreateResponseDto> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(); //Check if there is a valid session
  if (!user) {
    return redirect("/login");
  }
  const { data: { session }} = await supabase.auth.getSession();
  // console.log('session', session);
  const url = process.env.BACKEND_URL + '/deck/create'  
  // Trim whitespace from all string data
  const body = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );
  // console.log('body', body);
  let CreateDeckres: IDeckCreateResponseDto = {
    statusCode: 500,
    data: {
      error: 'Default error'
    } as IDeckCreateResponseData
  };
  try {
    const { data } = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    if (data) {
      CreateDeckres =  {
        statusCode: data.status,
        data: data.data as IDeckCreateResponseData,
      }
    }
    // console.log('CreateDeckres:', CreateDeckres
  } catch (error) {
    const { response } = error as AxiosError;
    // console.log('Error occured during deck creation: ', errResp);
    CreateDeckres = {
      statusCode: response!.status,
      data: response?.data as IDeckCreateResponseData,
    }
  }
  console.log('CreateDeckres:', CreateDeckres);
  return CreateDeckres;
}

export { CreateDeck }