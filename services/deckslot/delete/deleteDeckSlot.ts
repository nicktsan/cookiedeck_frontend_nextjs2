'use server';
import {
  DeckslotDeleteRequestSchema,
  DeckslotDeleteResponseSchema,
  DeckslotDeleteResponseDataSchema,
} from './deckslot-delete.schema';
import {
  DeckslotDeleteRequestDTO,
  DeckslotDeleteResponseDataDTO,
  DeckslotDeleteResponseDTO,
} from './deckslot-delete.dto';
import { validate } from '@/utils/schemaValidator';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { ENV } from '@/env';
import {
  ErrorResponseDataDTO,
  ErrorResponseDataSchema,
  ErrorResponseDTO,
} from '@/utils/error.schema';
export async function DeleteDeckSlot(
  deleteDeckRequest: DeckslotDeleteRequestDTO,
): Promise<DeckslotDeleteResponseDataDTO | ErrorResponseDataDTO> {
  const url = ENV.BACKEND_URL + '/deckslot/delete';
  const res: DeckslotDeleteResponseDTO | ErrorResponseDTO = await MakeApiRequest({
    url,
    method: 'DELETE',
    requestSchema: DeckslotDeleteRequestSchema,
    responseSchema: DeckslotDeleteResponseSchema,
    data: deleteDeckRequest,
  });
  if (res.statusCode >= 200 && res.statusCode <= 299) {
    const validated: DeckslotDeleteResponseDataDTO = validate(
      res.data,
      DeckslotDeleteResponseDataSchema,
      'DeckslotDeleteResponseDataSchema',
    );
    return validated;
  }
  const validatedError: ErrorResponseDataDTO = validate(
    res.data,
    ErrorResponseDataSchema,
    'ErrorResponseDataSchema',
  );
  // console.log("validated res: ", validated);
  return validatedError;
}
