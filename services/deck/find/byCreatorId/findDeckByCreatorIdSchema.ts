import { z } from 'zod';
import { DeckEntitySchema } from '../../deck.entity';
export const DeckFindRequestByCreatorIdSchema = z.object({
  creator_id: z.string().uuid({
    message: `creator_id must be a valid UUID`,
  }),
  nameOrderDirection: z
    .enum(['asc', 'desc'], {
      message: `nameOrderDirection must be 'asc' or 'desc'`,
    })
    .optional(),
  updatedAtOrderDirection: z
    .enum(['asc', 'desc'], {
      message: `updatedAtOrderDirection must be 'asc' or 'desc'`,
    })
    .optional(),
});

export const DeckFindResponseByCreatorIdDataSchema = z.object({
  decks: z.array(DeckEntitySchema).nullable().optional(),
  message: z.string().optional(),
});

export const DeckFindResponseByCreatorIdSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: DeckFindResponseByCreatorIdDataSchema,
});
