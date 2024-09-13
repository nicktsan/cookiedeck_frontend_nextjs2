'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckDeleteRequestDTO, DeckDeleteResponseDataDTO } from './deck-delete.dto';
import {
  DeckDeleteRequestSchema,
  DeckDeleteResponseDataSchema,
  DeckDeleteResponseSchema,
} from './deck-delete.schema';
import { ValidateSchema } from '@/utils/schemaValidator';
import { ENV } from '@/env';
import { ErrorResponseDataDTO } from '@/utils/error.schema';

export async function DeleteDeck(
  id: string,
): Promise<DeckDeleteResponseDataDTO | ErrorResponseDataDTO> {
  try {
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
    const validated: DeckDeleteResponseDataDTO = ValidateSchema({
      dto: deleteDeckResponse.data,
      schema: DeckDeleteResponseDataSchema,
      schemaName: 'DeckDeleteResponseDataSchema',
    });
    return validated;

  } catch (error) {
    console.error('Error deleting deck:');
    throw error;
  }
}
