'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckUpdateIncrementviewRequestDTO,
  DeckUpdateIncrementviewResponseDataDTO,
  DeckUpdateIncrementviewResponseDTO,
} from './deck-update-incrementview.dto';
import {
  DeckUpdateIncrementviewRequestSchema,
  // DeckUpdateIncrementviewResponseDataSchema,
  DeckUpdateIncrementviewResponseSchema,
} from './deck-update-incrementview.schema';
// import { ValidateSchema } from '@/utils/schemaValidator';
import { ENV } from '@/env';

//can use this as an example for error handling
export async function IncrementDeckView(
  deckUpdateIncrementviewRequestData: DeckUpdateIncrementviewRequestDTO,
): Promise<DeckUpdateIncrementviewResponseDataDTO> {
  try {
    const deckUpdateIncrementviewUrl = ENV.BACKEND_URL + '/deck/update/incrementview';
    // console.log("deckUpdateIncrementviewUrl: ", deckUpdateIncrementviewUrl)
    // console.log('deckUpdateIncrementviewRequestData: ', deckUpdateIncrementviewRequestData);
    const deckUpdateIncrementviewResponse:
      DeckUpdateIncrementviewResponseDTO
      = await MakeApiRequest({
      url: deckUpdateIncrementviewUrl,
      method: 'PATCH',
      requestSchema: DeckUpdateIncrementviewRequestSchema,
      responseSchema: DeckUpdateIncrementviewResponseSchema,
      data: deckUpdateIncrementviewRequestData,
    });
    // const validated: DeckUpdateIncrementviewResponseDataDTO = ValidateSchema({
    //   dto: deckUpdateIncrementviewResponse.data,
    //   schema: DeckUpdateIncrementviewResponseDataSchema,
    //   schemaName: 'DeckUpdateIncrementviewResponseDataSchema',
    // });
    // console.log("validated deckUpdateIncrementviewResponse: ", validated);
    return deckUpdateIncrementviewResponse.data as DeckUpdateIncrementviewResponseDataDTO
    // return validated;
  } catch (error) {
    console.log('Error incrementing deck view:');
    throw error;
  }
}
