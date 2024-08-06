import { z } from 'zod';
import { DeckslotFindResponseSchema } from '../deckslot-find.dto';
export const DeckslotFindByDeckIdRequestSchema = z.object({
  deck_id: z.string().uuid(),
});

export const DeckslotFindByDeckIdResponseDataSchema = z.object({
  deckslots: z.array(DeckslotFindResponseSchema).nullable().optional(),
  message: z.string().optional(),
  
});

export const DeckslotFindByDeckIdResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: DeckslotFindByDeckIdResponseDataSchema,
});
