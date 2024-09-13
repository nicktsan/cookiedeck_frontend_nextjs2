'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckFindCustomRequestDTO,
  DeckFindCustomResponseDataDTO,
  DeckFindCustomResponseDTO,
} from './deck-find-custom.dto';
import {
  DeckFindCustomRequestSchema,
  DeckFindCustomResponseDataSchema,
  DeckFindCustomResponseSchema,
} from './deck-find-custom.schema';
import { ValidateSchema } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function DeckFindCustom(name: string): Promise<DeckFindCustomResponseDataDTO> {
  try {
    const deckFindCustomUrl = ENV.BACKEND_URL + '/deck/find/custom';
    const deckFindCustomRequestData: DeckFindCustomRequestDTO = {
      select: ['name', 'views', 'username', 'image_link'],
      name: name,
    };
    // console.log("deckFindCustomUrl: ", deckFindCustomUrl)
    const deckFindCustomResponse: DeckFindCustomResponseDTO = await MakeApiRequest({
      url: deckFindCustomUrl,
      method: 'POST',
      requestSchema: DeckFindCustomRequestSchema,
      responseSchema: DeckFindCustomResponseSchema,
      data: deckFindCustomRequestData,
    });
    // console.log("raw deckFindCustomResponse: ", deckFindCustomResponse);
    const validated: DeckFindCustomResponseDataDTO = ValidateSchema({
      dto: deckFindCustomResponse.data,
      schema: DeckFindCustomResponseDataSchema,
      schemaName: 'DeckFindCustomResponseDataSchema',
    });
    // console.log("validated deckFindCustomResponse: ", validated);
    // console.log('validated deckFindCustomResponse decks: ', validated.decks);
    return validated;
  } catch (error) {
    console.error('Error finding deck during search:');
    throw error;
  }
}
