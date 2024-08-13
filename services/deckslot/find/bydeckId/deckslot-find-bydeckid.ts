'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckslotFindByDeckIdRequestDTO,
  DeckslotFindByDeckIdResponseDataDTO,
} from './deckslot-find-bydeckid.dto';
import {
  DeckslotFindByDeckIdRequestSchema,
  DeckslotFindByDeckIdResponseDataSchema,
  DeckslotFindByDeckIdResponseSchema,
} from './deckslot-find-bydeckid.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function DeckSlotFindByDeckId(
  id: string,
): Promise<DeckslotFindByDeckIdResponseDataDTO> {
  try {
    // console.log('DeckSlotFindByDeckId triggered');
    const deckSlotFindUrl = ENV.BACKEND_URL + '/deckslot/find/bydeckid';
    const deckSlotFindRequestData: DeckslotFindByDeckIdRequestDTO = { deck_id: id };
    // console.log("deckSlotFindUrl: ", deckSlotFindUrl)
    const deckSlotFindResponse = await MakeApiRequest({
      url: deckSlotFindUrl,
      method: 'GET',
      requestSchema: DeckslotFindByDeckIdRequestSchema,
      responseSchema: DeckslotFindByDeckIdResponseSchema,
      data: deckSlotFindRequestData,
    });
    // console.log("raw deckSlotFindResponse: ", deckSlotFindResponse.data);
    const validatedRes: DeckslotFindByDeckIdResponseDataDTO = validate(
      deckSlotFindResponse.data,
      DeckslotFindByDeckIdResponseDataSchema,
      'DeckslotFindByDeckIdResponseDataSchema',
    );
    // console.log("validated deckSlotFindResponse: ", validatedRes);
    return validatedRes;
  } catch (error) {
    console.error('Error fetching deckslot:', error);
    throw error;
  }
}