import { z } from 'zod';
export const DeckEntitySchema = z.object({
  //todo add years, days, hours, minutes, seconds
  id: z.string().uuid({
    message: `creator_id must be a valid UUID`,
  }),
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
  description: z.string().nullable().optional(),
  views: z.number().optional(),
  visibility: z
    .enum(['public', 'private', 'unlisted'], {
      message: 'Visibility must be a valid value.',
    })
    .optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type DeckEntity = z.infer<typeof DeckEntitySchema>;
export interface IDeckIdProps {
  deckId: string;
}
