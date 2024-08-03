'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckFindRequestDTO, DeckFindResponseDataDTO } from './findDeckDTO';
import {
  DeckFindRequestSchema,
  DeckFindResponseDataSchema,
  DeckFindResponseSchema,
} from './findDeckSchema';
import { validate } from '@/utils/schemaValidator';

export async function FindDeck(id: string): Promise<DeckFindResponseDataDTO> {
  const deckFindUrl = process.env.BACKEND_URL + '/deck/find';
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
}
