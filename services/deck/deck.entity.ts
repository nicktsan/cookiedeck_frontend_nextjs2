import { z } from 'zod';
export const DeckEntitySchema = z.object({
  id: z.string().uuid({
    message: `creator_id must be a valid UUID`,
  }),
  unique_colors: z.array(z.string()).nullable().optional(),
  name: z.string().min(3).optional(),
  creator_id: z
    .string()
    .uuid({
      message: `creator_id must be a valid UUID`,
    })
    .optional(),
  username: z
    .string({
      message: `username must be a string`,
    })
    .optional(),
  folder_id: z
    .string()
    .uuid({
      message: `creator_id must be a valid UUID`,
    })
    .nullable()
    .optional(),
  banner: z.number().nullable().optional(),
  image_link: z.string().nullable().optional(), //This field comes from cards. Other fields come from deckTable.
  description: z.string().nullable().optional(),
  views: z.number().optional(),
  visibility: z
    .enum(['public', 'private', 'unlisted'], {
      message: 'Visibility must be a valid value.',
    })
    .optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  years: z.number().optional(),
  months: z.number().optional(),
  days: z.number().optional(),
  hours: z.number().optional(),
  minutes: z.number().optional(),
  seconds: z.number().optional(),
});

export type DeckEntity = z.infer<typeof DeckEntitySchema>;
export interface IDeckIdProps {
  deckId: string;
}
