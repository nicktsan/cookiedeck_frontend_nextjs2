'use server';
import {
  CardSearchRequestSchema,
  CardSearchResponseSchema,
  CardSearchResponseDataSchema,
} from './card-find.schema';
import {
  CardSearchRequestDTO,
  CardSearchResponseDTO,
  CardSearchResponseDataDTO,
} from './card-findDTO';
import { ValidateSchema } from '@/utils/schemaValidator';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { CardEntity } from '../card.entity';
import { ENV } from '@/env';
export async function CardFind(formData: CardSearchRequestDTO): Promise<CardEntity[]> {
  function validate(dto: unknown): CardSearchResponseDataDTO {
    return ValidateSchema({
      dto,
      schema: CardSearchResponseDataSchema,
      schemaName: 'CardSearchResponseDataSchema',
    });
  }
  const url = ENV.BACKEND_URL + '/card/find';
  const params: CardSearchRequestDTO = {
    select: ['id', 'name_eng', 'name_kr', 'color'],
    name: formData.name,
  };
  const res: CardSearchResponseDTO = await MakeApiRequest({
    url,
    method: 'POST',
    requestSchema: CardSearchRequestSchema,
    responseSchema: CardSearchResponseSchema,
    data: params,
  });
  validate(res.data);
  let cards: CardEntity[] = [];
  if (res.data.cards) {
    cards = res.data.cards;
  }
  return cards;
}
