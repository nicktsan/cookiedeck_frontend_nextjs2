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
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ResponseError } from '@/utils/responseError';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

export async function DeckFindCustom(name: string): Promise<DeckFindCustomResponseDataDTO> {
  try {
    const deckFindCustomUrl = ENV.BACKEND_URL + '/deck/find/custom';
    const deckFindCustomRequestData: DeckFindCustomRequestDTO = {
      select: ['name', 'views', 'username', 'image_link'],
      name: name,
    };
    // console.log("deckFindCustomUrl: ", deckFindCustomUrl)
    const deckFindCustomResponse:
      | DeckFindCustomResponseDTO
      | ResponseError
      | AxiosError
      | ZodError
      | Error = await MakeApiRequest({
      url: deckFindCustomUrl,
      method: 'POST',
      requestSchema: DeckFindCustomRequestSchema,
      responseSchema: DeckFindCustomResponseSchema,
      data: deckFindCustomRequestData,
    });
    // console.log("raw deckFindCustomResponse: ", deckFindCustomResponse);

    if (
      deckFindCustomResponse instanceof AxiosError ||
      deckFindCustomResponse instanceof ResponseError ||
      deckFindCustomResponse instanceof ZodError ||
      deckFindCustomResponse instanceof Error
    ) {
      throw deckFindCustomResponse;
    }

    const validated: DeckFindCustomResponseDataDTO = validate(
      deckFindCustomResponse.data,
      DeckFindCustomResponseDataSchema,
      'DeckFindCustomResponseDataSchema',
    );
    // console.log("validated deckFindCustomResponse: ", validated);
    console.log("validated deckFindCustomResponse decks: ", validated.decks)
    return validated;
  } catch (error) {
    console.error('Error finding deck during search:');
    throw error;
  }
}
