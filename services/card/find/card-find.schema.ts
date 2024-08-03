import { z } from 'zod';
import { CardEntitySchema } from '@/services/card/card.entity';

export const CardSearchRequestSchema = z.object({
  select: z
    .array(
      z.enum([
        'id',
        'name_eng',
        'name_kr',
        'code',
        'rarity',
        'card_type',
        'color',
        'card_level',
        'plain_text_eng',
        'plain_text',
        'expansion',
        'illustrator',
      ]),
    )
    .optional(),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
});

export const CardSearchResponseDataSchema = z.object({
  cards: z.array(CardEntitySchema).nullable().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const CardSearchResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: CardSearchResponseDataSchema,
});
