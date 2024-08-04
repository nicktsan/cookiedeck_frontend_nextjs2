'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckUpdateRequestDTO, DeckUpdateResponseDataDTO } from './deck-update.dto';
import {
  DeckUpdateRequestSchema,
  DeckUpdateResponseDataSchema,
  DeckUpdateResponseSchema,
} from './deck-update.schema';
import { validate } from '@/utils/schemaValidator';

export async function UpdateDeck(
  deckUpdateRequestData: DeckUpdateRequestDTO,
): Promise<DeckUpdateResponseDataDTO> {
  const deckUpdateUrl = process.env.BACKEND_URL + '/deck/update';
  // console.log("deckUpdateUrl: ", deckUpdateUrl)
  // console.log('deckUpdateRequestData: ', deckUpdateRequestData);
  const deckUpdateResponse = await MakeApiRequest({
    url: deckUpdateUrl,
    method: 'PATCH',
    requestSchema: DeckUpdateRequestSchema,
    responseSchema: DeckUpdateResponseSchema,
    data: deckUpdateRequestData,
  });
  // console.log("raw deckUpdateResponse: ", deckUpdateResponse);
  const validated: DeckUpdateResponseDataDTO = validate(
    deckUpdateResponse.data,
    DeckUpdateResponseDataSchema,
    'DeckUpdateResponseDataSchema',
  );
  // console.log("validated deckUpdateResponse: ", validated);
  return validated;
}
