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
import { ErrorResponseDTO } from '@/utils/error.schema';
export async function CardFind(formData: CardSearchRequestDTO): Promise<CardEntity[]> {
  function validate(dto: unknown): CardSearchResponseDataDTO {
    return ValidateSchema({
      dto,
      schema: CardSearchResponseDataSchema,
      schemaName: 'CardSearchResponseDataSchema',
    });
  }
  try {
    const url = ENV.BACKEND_URL + '/card/find';
    const params: CardSearchRequestDTO = {
      select: ['id', 'name_eng', 'name_kr', 'color', 'card_type', 'plain_text_eng', 'code'],
      name: formData.name,
    };
    // console.log('params: ', params);
    const res: CardSearchResponseDTO | ErrorResponseDTO | Error = await MakeApiRequest({
      url,
      method: 'POST',
      requestSchema: CardSearchRequestSchema,
      responseSchema: CardSearchResponseSchema,
      data: params,
    });
    if (res instanceof Error) throw res;
    const validatedRes = validate(res.data);
    let cards: CardEntity[] = [];
    if (validatedRes.cards) {
      cards = validatedRes.cards;
    }
    return cards;
  } catch (error) {
    if (error instanceof Error) {
      //todo handle generic Error
    }
    //todo additional error handling can be added based on error class
    console.error('Error searching for cards:', error);
    throw error;
  }
}
