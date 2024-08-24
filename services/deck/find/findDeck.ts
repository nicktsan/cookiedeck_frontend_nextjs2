'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckFindRequestDTO, DeckFindResponseDataDTO, DeckFindResponseDTO } from './findDeckDTO';
import {
  DeckFindRequestSchema,
  DeckFindResponseDataSchema,
  DeckFindResponseSchema,
} from './findDeckSchema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ZodError } from 'zod';
import { ErrorResponseDataDTO, ErrorResponseDataSchema, ErrorResponseDTO } from '@/utils/error.schema';

const isDeckFindResponseDTO = (obj: any): obj is DeckFindResponseDTO => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'statusCode' in obj &&
    typeof obj.statusCode === 'number' &&
    'data' in obj &&
    typeof obj.data === 'object' &&
    obj.data !== null &&
    'id' in obj.data &&
    typeof obj.data.id === 'string'
  );
};
export async function FindDeck(id: string): Promise<DeckFindResponseDataDTO> {
  try {
    // console.log('FindDeck triggered');
    const deckFindUrl = ENV.BACKEND_URL + '/deck/find';
    const deckFindRequestData: DeckFindRequestDTO = { id: id };
    // console.log("deckFindUrl: ", deckFindUrl)
    const deckFindResponse: DeckFindResponseDTO | ErrorResponseDTO | ZodError | Error = await MakeApiRequest({
      url: deckFindUrl,
      method: 'GET',
      requestSchema: DeckFindRequestSchema,
      responseSchema: DeckFindResponseSchema,
      data: deckFindRequestData,
    });
    if (isDeckFindResponseDTO(deckFindResponse)){
      const validated: DeckFindResponseDataDTO = validate(
        deckFindResponse.data,
        DeckFindResponseDataSchema,
        'DeckFindResponseDataSchema',
      );
      return validated;
    }
    if (deckFindResponse instanceof ZodError || deckFindResponse instanceof Error) {
      throw deckFindResponse;
    } 

    const validatedError: ErrorResponseDataDTO = validate(
      deckFindResponse.data,
      ErrorResponseDataSchema,
      'ErrorResponseDataSchema',
    );
    throw validatedError;
    // console.log("validated deckFindResponse: ", validated);
  } catch (error) {
    console.error('Error finding deck:');
    throw error
  }
}
