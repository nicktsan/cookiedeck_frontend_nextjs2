'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckUpdateIncrementviewRequestDTO,
  DeckUpdateIncrementviewResponseDataDTO,
  DeckUpdateIncrementviewResponseDTO,
} from './deck-update-incrementview.dto';
import {
  DeckUpdateIncrementviewRequestSchema,
  DeckUpdateIncrementviewResponseDataSchema,
  DeckUpdateIncrementviewResponseSchema,
} from './deck-update-incrementview.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ZodError } from 'zod';
import { ResponseError } from '@/utils/responseError';
import { AxiosError } from 'axios';

//can use this as an example for error handling
export async function IncrementDeckView(
  deckUpdateIncrementviewRequestData: DeckUpdateIncrementviewRequestDTO,
): Promise<DeckUpdateIncrementviewResponseDataDTO> {
  try {
    const deckUpdateIncrementviewUrl = ENV.BACKEND_URL + '/deck/update/incrementview';
    // console.log("deckUpdateIncrementviewUrl: ", deckUpdateIncrementviewUrl)
    // console.log('deckUpdateIncrementviewRequestData: ', deckUpdateIncrementviewRequestData);
    const deckUpdateIncrementviewResponse:
      | DeckUpdateIncrementviewResponseDTO
      | ResponseError
      | AxiosError
      | ZodError
      | Error = await MakeApiRequest({
      url: deckUpdateIncrementviewUrl,
      method: 'PATCH',
      requestSchema: DeckUpdateIncrementviewRequestSchema,
      responseSchema: DeckUpdateIncrementviewResponseSchema,
      data: deckUpdateIncrementviewRequestData,
    });

    // console.log("raw deckUpdateIncrementviewResponse: ", deckUpdateIncrementviewResponse);
    if (
      deckUpdateIncrementviewResponse instanceof AxiosError ||
      deckUpdateIncrementviewResponse instanceof ResponseError ||
      deckUpdateIncrementviewResponse instanceof ZodError ||
      deckUpdateIncrementviewResponse instanceof Error
    ) {
      throw deckUpdateIncrementviewResponse;
    }
    const validated: DeckUpdateIncrementviewResponseDataDTO = validate(
      deckUpdateIncrementviewResponse.data,
      DeckUpdateIncrementviewResponseDataSchema,
      'DeckUpdateIncrementviewResponseDataSchema',
    );
    // console.log("validated deckUpdateIncrementviewResponse: ", validated);
    return validated;
  } catch (error) {
    console.log('Error incrementing deck view:');
    throw error;
  }
}
