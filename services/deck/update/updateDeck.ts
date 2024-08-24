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
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ResponseError } from '@/utils/responseError';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

export async function UpdateDeck(
  deckUpdateRequestData: DeckUpdateRequestDTO,
): Promise<DeckUpdateResponseDataDTO> {
  try {
    const deckUpdateUrl = ENV.BACKEND_URL + '/deck/update';
    // console.log("deckUpdateUrl: ", deckUpdateUrl)
    // console.log('deckUpdateRequestData: ', deckUpdateRequestData);
    const deckUpdateResponse:
      | DeckUpdateResponseDTO
      | ResponseError
      | AxiosError
      | ZodError
      | Error = await MakeApiRequest({
      url: deckUpdateUrl,
      method: 'PATCH',
      requestSchema: DeckUpdateRequestSchema,
      responseSchema: DeckUpdateResponseSchema,
      data: deckUpdateRequestData,
    });
    if (
      deckUpdateResponse instanceof AxiosError ||
      deckUpdateResponse instanceof ResponseError ||
      deckUpdateResponse instanceof ZodError ||
      deckUpdateResponse instanceof Error
    ) {
      throw deckUpdateResponse;
    }
    // console.log("raw deckUpdateResponse: ", deckUpdateResponse);
    const validated: DeckUpdateResponseDataDTO = validate(
      deckUpdateResponse.data,
      DeckUpdateResponseDataSchema,
      'DeckUpdateResponseDataSchema',
    );
    // console.log("validated deckUpdateResponse: ", validated);
    return validated;
  } catch (error) {
    console.error('Error updating deck:');
    throw error;
  }
}
