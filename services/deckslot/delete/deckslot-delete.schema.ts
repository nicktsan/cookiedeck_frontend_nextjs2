import { z } from 'zod';
export const DeckslotDeleteRequestSchema = z.object({
  deck_id: z.string().uuid(),
  card_id: z.number(),
  board: z
    .enum(['main', 'maybe'], {
      message: `board must be 'main' or 'maybe'.`,
    })
    .optional(),
});

export const DeckslotDeleteResponseDataSchema = z.object({
  deck_id: z.string().uuid().optional(),
  card_id: z.number().optional(),
  board: z.string().optional(),
  quantity: z.number().optional(),
  message: z.string().optional(),
});
export const DeckslotDeleteResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: DeckslotDeleteResponseDataSchema,
});
