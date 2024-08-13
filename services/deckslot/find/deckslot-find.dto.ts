import { z } from 'zod';
export const DeckslotFindResponseSchema = z.object({
  deck_id: z.string().uuid({
    message: 'deck_id must be a valid UUID',
  }),
  card_id: z.number(),
  board: z.enum(['main', 'maybe'], {
    message: "board must be 'main' or 'maybe'",
  }),
  quantity: z.number().optional(),
  message: z.string().optional(),
  name_eng: z.string().optional(),
  name_kr: z.string().optional(),
  code: z.string().optional(),
  rarity: z.string().optional(),
  // rarity_abb: z.string().optional(),
  card_type: z.string().optional(),
  color: z.string().optional(),
  card_level: z.number().nullable().optional(),
  plain_text_eng: z.string().optional(),
  plain_text: z.string().optional(),
  expansion: z.string().nullable().optional(),
  illustrator: z.string().optional(),
  image_link: z.string().optional(),
  image_link_en: z.string().optional(),
});

export type DeckslotFindResponseDTO = z.infer<typeof DeckslotFindResponseSchema>;
