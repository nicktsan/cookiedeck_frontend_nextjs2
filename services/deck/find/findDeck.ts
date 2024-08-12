'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckFindRequestDTO, DeckFindResponseDataDTO } from './findDeckDTO';
import {
  DeckFindRequestSchema,
  DeckFindResponseDataSchema,
  DeckFindResponseSchema,
} from './findDeckSchema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function FindDeck(id: string): Promise<DeckFindResponseDataDTO> {
  try {
    // console.log('FindDeck triggered');
    const deckFindUrl = ENV.BACKEND_URL + '/deck/find';
    const deckFindRequestData: DeckFindRequestDTO = { id: id };
    // console.log("deckFindUrl: ", deckFindUrl)
    const deckFindResponse = await MakeApiRequest({
      url: deckFindUrl,
      method: 'GET',
      requestSchema: DeckFindRequestSchema,
      responseSchema: DeckFindResponseSchema,
      data: deckFindRequestData,
    });
    // console.log("raw deckFindResponse: ", deckFindResponse);
    const validated: DeckFindResponseDataDTO = validate(
      deckFindResponse.data,
      DeckFindResponseDataSchema,
      'DeckFindResponseDataSchema',
    );
    // console.log("validated deckFindResponse: ", validated);
    return validated;
  } catch (error) {
    console.error('Error finding deck:', error);
    throw error;
  }
}
