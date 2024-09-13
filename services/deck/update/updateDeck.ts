'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckUpdateRequestDTO,
  DeckUpdateResponseDataDTO,
  DeckUpdateResponseDTO,
} from './deck-update.dto';
import {
  DeckUpdateRequestSchema,
  DeckUpdateResponseDataSchema,
  DeckUpdateResponseSchema,
} from './deck-update.schema';
import { ValidateSchema } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function UpdateDeck(
  deckUpdateRequestData: DeckUpdateRequestDTO,
): Promise<DeckUpdateResponseDataDTO> {
  try {
    const deckUpdateUrl = ENV.BACKEND_URL + '/deck/update';
    // console.log("deckUpdateUrl: ", deckUpdateUrl)
    // console.log('deckUpdateRequestData: ', deckUpdateRequestData);
    const deckUpdateResponse: DeckUpdateResponseDTO = await MakeApiRequest({
      url: deckUpdateUrl,
      method: 'PATCH',
      requestSchema: DeckUpdateRequestSchema,
      responseSchema: DeckUpdateResponseSchema,
      data: deckUpdateRequestData,
    });
    // console.log("raw deckUpdateResponse: ", deckUpdateResponse);
    const validated: DeckUpdateResponseDataDTO = ValidateSchema({
      dto: deckUpdateResponse.data,
      schema: DeckUpdateResponseDataSchema,
      schemaName: 'DeckUpdateResponseDataSchema',
    });
    // console.log("validated deckUpdateResponse: ", validated);
    return validated;
  } catch (error) {
    console.error('Error updating deck:');
    throw error;
  }
}
