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
import { ValidateSchema } from '@/utils/schemaValidator';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { ENV } from '@/env';

export async function DeleteDeckSlot(
  deleteDeckRequest: DeckslotDeleteRequestDTO,
): Promise<DeckslotDeleteResponseDataDTO> {
  try {
    const url = ENV.BACKEND_URL + '/deckslot/delete';
    const res: DeckslotDeleteResponseDTO = await MakeApiRequest({
      url,
      method: 'DELETE',
      requestSchema: DeckslotDeleteRequestSchema,
      responseSchema: DeckslotDeleteResponseSchema,
      data: deleteDeckRequest,
    });
    const validated: DeckslotDeleteResponseDataDTO = ValidateSchema({
      dto: res.data,
      schema: DeckslotDeleteResponseDataSchema,
      schemaName: 'DeckslotDeleteResponseDataSchema',
    });
    return validated;
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
}
