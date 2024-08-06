'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckUpdateIncrementviewRequestDTO, DeckUpdateIncrementviewResponseDataDTO } from './deck-update-incrementview.dto';
import {
  DeckUpdateIncrementviewRequestSchema,
  DeckUpdateIncrementviewResponseDataSchema,
  DeckUpdateIncrementviewResponseSchema,
} from './deck-update-incrementview.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function IncrementDeckView(
  deckUpdateIncrementviewRequestData: DeckUpdateIncrementviewRequestDTO,
): Promise<DeckUpdateIncrementviewResponseDataDTO> {
  const deckUpdateIncrementviewUrl = ENV.BACKEND_URL + '/deck/update/incrementview';
  // console.log("deckUpdateIncrementviewUrl: ", deckUpdateIncrementviewUrl)
  // console.log('deckUpdateIncrementviewRequestData: ', deckUpdateIncrementviewRequestData);
  const deckUpdateIncrementviewResponse = await MakeApiRequest({
    url: deckUpdateIncrementviewUrl,
    method: 'PATCH',
    requestSchema: DeckUpdateIncrementviewRequestSchema,
    responseSchema: DeckUpdateIncrementviewResponseSchema,
    data: deckUpdateIncrementviewRequestData,
  });
  // console.log("raw deckUpdateIncrementviewResponse: ", deckUpdateIncrementviewResponse);
  const validated: DeckUpdateIncrementviewResponseDataDTO = validate(
    deckUpdateIncrementviewResponse.data,
    DeckUpdateIncrementviewResponseDataSchema,
    'DeckUpdateIncrementviewResponseDataSchema',
  );
  // console.log("validated deckUpdateIncrementviewResponse: ", validated);
  return validated;
}
