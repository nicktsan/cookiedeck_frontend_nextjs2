'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckDeleteRequestDTO, DeckDeleteResponseDataDTO } from './deck-delete.dto';
import {
  DeckDeleteRequestSchema,
  DeckDeleteResponseDataSchema,
  DeckDeleteResponseSchema,
} from './deck-delete.schema';
import { validate } from '@/utils/schemaValidator';

export async function DeleteDeck(id: string): Promise<DeckDeleteResponseDataDTO> {
  const deleteDeckUrl = process.env.BACKEND_URL + '/deck/delete';
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
  const validated: DeckDeleteResponseDataDTO = validate(
    deleteDeckResponse.data,
    DeckDeleteResponseDataSchema,
    'DeckDeleteResponseDataSchema',
  );
  // console.log("validated deleteDeckResponse: ", validated);
  return validated;
}
