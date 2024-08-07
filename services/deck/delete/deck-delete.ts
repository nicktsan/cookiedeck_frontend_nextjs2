'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckDeleteRequestDTO, DeckDeleteResponseDataDTO } from './deck-delete.dto';
import {
  DeckDeleteRequestSchema,
  DeckDeleteResponseDataSchema,
  DeckDeleteResponseSchema,
} from './deck-delete.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ErrorResponseDataDTO, ErrorResponseDataSchema } from '@/utils/error.schema';

export async function DeleteDeck(
  id: string,
): Promise<DeckDeleteResponseDataDTO | ErrorResponseDataDTO> {
  const deleteDeckUrl = ENV.BACKEND_URL + '/deck/delete';
  const deleteDeckRequestData: DeckDeleteRequestDTO = { id: id };
  // console.log("deleteDeckUrl: ", deleteDeckUrl)
  const deleteDeckResponse = await MakeApiRequest({
    url: deleteDeckUrl,
    method: 'DELETE',
    requestSchema: DeckDeleteRequestSchema,
    responseSchema: DeckDeleteResponseSchema,
    data: deleteDeckRequestData,
  });
  // console.log("raw deleteDeckResponse: ", deleteDeckResponse);

  if (deleteDeckResponse.statusCode >= 200 && deleteDeckResponse.statusCode <= 299) {
    const validated: DeckDeleteResponseDataDTO = validate(
      deleteDeckResponse.data,
      DeckDeleteResponseDataSchema,
      'DeckDeleteResponseDataSchema',
    );
    return validated;
  }
  const validatedError: ErrorResponseDataDTO = validate(
    deleteDeckResponse.data,
    ErrorResponseDataSchema,
    'ErrorResponseDataSchema',
  );
  // console.log("validated deleteDeckResponse: ", validated);
  return validatedError;
}
