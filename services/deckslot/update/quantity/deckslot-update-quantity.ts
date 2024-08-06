'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckslotUpdateQuantityRequestDTO,
  DeckslotUpdateQuantityResponseDataDTO,
} from './deckslot-update-quantity.dto';
import {
  DeckslotUpdateQuantityRequestSchema,
  DeckslotUpdateQuantityResponseDataSchema,
  DeckslotUpdateQuantityResponseSchema,
} from './deckslot-update-quantity.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';

export async function UpdateDeckSlotQuantity(
  payload: DeckslotUpdateQuantityRequestDTO,
): Promise<DeckslotUpdateQuantityResponseDataDTO> {
  const deckSlotUpdateUrl = ENV.BACKEND_URL + '/deckslot/update/quantity';
  // console.log('deckSlotUpdateUrl: ', deckSlotUpdateUrl);
  // console.log('payload: ', payload);
  const deckSlotUpdateResponse = await MakeApiRequest({
    url: deckSlotUpdateUrl,
    method: 'PATCH',
    requestSchema: DeckslotUpdateQuantityRequestSchema,
    responseSchema: DeckslotUpdateQuantityResponseSchema,
    data: payload,
  });
  // console.log('raw deckSlotUpdateResponse: ', deckSlotUpdateResponse.data);
  const validatedRes: DeckslotUpdateQuantityResponseDataDTO = validate(
    deckSlotUpdateResponse.data,
    DeckslotUpdateQuantityResponseDataSchema,
    'DeckslotUpdateQuantityResponseDataSchema',
  );
  // console.log('validated deckSlotUpdateResponse: ', validatedRes);
  return validatedRes;
}
