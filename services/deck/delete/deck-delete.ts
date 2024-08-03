'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { IDeckDeleteRequestDTO, IDeckDeleteResponseDataDTO } from './deck-delete.dto';
import {
  IDeckDeleteRequestSchema,
  IDeckDeleteResponseDataSchema,
  IDeckDeleteResponseSchema,
} from './deck-delete.schema';
import { validate } from '@/utils/schemaValidator';

export async function DeleteDeck(id: string): Promise<IDeckDeleteResponseDataDTO> {
  const deleteDeckUrl = process.env.BACKEND_URL + '/deck/delete';
  const deleteDeckRequestData: IDeckDeleteRequestDTO = { id: id };
  // console.log("deleteDeckUrl: ", deleteDeckUrl)
  const deleteDeckResponse = await MakeApiRequest({
    url: deleteDeckUrl,
    method: 'DELETE',
    requestSchema: IDeckDeleteRequestSchema,
    responseSchema: IDeckDeleteResponseSchema,
    data: deleteDeckRequestData,
  });
  // console.log("raw deleteDeckResponse: ", deleteDeckResponse);
  const validated: IDeckDeleteResponseDataDTO = validate(
    deleteDeckResponse.data,
    IDeckDeleteResponseDataSchema,
    'IDeckDeleteResponseDataSchema',
  );
  // console.log("validated deleteDeckResponse: ", validated);
  return validated;
}
