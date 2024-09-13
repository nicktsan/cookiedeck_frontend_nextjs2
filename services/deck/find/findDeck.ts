'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckFindRequestDTO, DeckFindResponseDataDTO, DeckFindResponseDTO } from './findDeckDTO';
import {
  DeckFindRequestSchema,
  DeckFindResponseDataSchema,
  DeckFindResponseSchema,
} from './findDeckSchema';
import { ValidateSchema } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function FindDeck(id: string): Promise<DeckFindResponseDataDTO> {
  try {
    // console.log('FindDeck triggered');
    const deckFindUrl = ENV.BACKEND_URL + '/deck/find';
    const deckFindRequestData: DeckFindRequestDTO = { id: id };
    // console.log("deckFindUrl: ", deckFindUrl)
    const deckFindResponse: DeckFindResponseDTO =
      await MakeApiRequest({
        url: deckFindUrl,
        method: 'GET',
        requestSchema: DeckFindRequestSchema,
        responseSchema: DeckFindResponseSchema,
        data: deckFindRequestData,
      });

    const validated: DeckFindResponseDataDTO = ValidateSchema({
      dto: deckFindResponse.data,
      schema: DeckFindResponseDataSchema,
      schemaName: 'DeckFindResponseDataSchema'
    });
    return validated;
    // console.log("validated deckFindResponse: ", validated);
  } catch (error) {
    console.error('Error finding deck:');
    throw error;
  }
}
