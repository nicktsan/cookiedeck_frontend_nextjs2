'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckFindCustomRequestDTO, DeckFindCustomResponseDataDTO } from './deck-find-custom.dto';
import {
  DeckFindCustomRequestSchema,
  DeckFindCustomResponseDataSchema,
  DeckFindCustomResponseSchema,
} from './deck-find-custom.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ErrorResponseDataDTO, ErrorResponseDataSchema } from '@/utils/error.schema';

export async function DeckFindCustom(
  name: string,
): Promise<DeckFindCustomResponseDataDTO | ErrorResponseDataDTO> {
  try {
    const deckFindCustomUrl = ENV.BACKEND_URL + '/deck/find/custom';
    const deckFindCustomRequestData: DeckFindCustomRequestDTO = {
      select: ['name', 'views', 'username', 'updated_at'],
      name: name,
    };
    // console.log("deckFindCustomUrl: ", deckFindCustomUrl)
    const deckFindCustomResponse = await MakeApiRequest({
      url: deckFindCustomUrl,
      method: 'POST',
      requestSchema: DeckFindCustomRequestSchema,
      responseSchema: DeckFindCustomResponseSchema,
      data: deckFindCustomRequestData,
    });
    // console.log("raw deckFindCustomResponse: ", deckFindCustomResponse);

    if (deckFindCustomResponse.statusCode >= 200 && deckFindCustomResponse.statusCode <= 299) {
      const validated: DeckFindCustomResponseDataDTO = validate(
        deckFindCustomResponse.data,
        DeckFindCustomResponseDataSchema,
        'DeckFindCustomResponseDataSchema',
      );
      // console.log("validated deckFindCustomResponse: ", validated);
      return validated;
    }
    const validatedError: ErrorResponseDataDTO = validate(
      deckFindCustomResponse.data,
      ErrorResponseDataSchema,
      'ErrorResponseDataSchema',
    );
    return validatedError;
  } catch (error) {
    console.error('Error finding custom deck:', error);
    throw error;
  }
}
