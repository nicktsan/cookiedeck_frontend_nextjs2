'use server';
import {
  DeckslotCreateRequestSchema,
  DeckslotCreateResponseSchema,
  DeckslotCreateResponseDataSchema,
} from './deckslot-create.schema';
import {
  DeckslotCreateRequestDTO,
  DeckslotCreateResponseDataDTO,
  DeckslotCreateResponseDTO,
} from './deckslot-createDTO';
import { ValidateSchema } from '@/utils/schemaValidator';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { CardEntity } from '@/services/card/card.entity';
export async function CreateDeckSlot(
  cardData: CardEntity,
  deckId: string | undefined,
): Promise<boolean> {
  function validate(dto: unknown): DeckslotCreateResponseDataDTO {
    return ValidateSchema({
      dto,
      schema: DeckslotCreateResponseDataSchema,
      schemaName: 'DeckslotCreateResponseDataSchema',
    });
  }
  const url = process.env.BACKEND_URL + '/deckslot/create';
  if (!deckId) {
    return false;
  }
  const params: DeckslotCreateRequestDTO = {
    deck_id: deckId,
    card_id: cardData.id,
    board: 'main',
  };
  const res: DeckslotCreateResponseDTO = await MakeApiRequest({
    url,
    method: 'POST',
    requestSchema: DeckslotCreateRequestSchema,
    responseSchema: DeckslotCreateResponseSchema,
    data: params,
  });
  validate(res.data);
  // console.log('CreateDeckSlot res:', res.data);
  if (!res.data.error) {
    return true;
  }
  return false;
}
