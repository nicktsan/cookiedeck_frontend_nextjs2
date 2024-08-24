import { z } from 'zod';
export const DeckFindRequestSchema = z.object({
  id: z.string().uuid({
    message: `Id must be a valid UUID`,
  }),
});

export const DeckFindResponseDataSchema = z.object({
  id: z.string().uuid({
    message: `Id must be a valid UUID`,
  }),
  name: z
    .string()
    .min(3, {
      message: `Name must be at least 3 characters`,
    })
    .optional(),
  creator_id: z
    .string()
    .uuid({
      message: `creator_id must be a valid UUID`,
    })
    .optional(),
  creator_username: z.string().optional(),
  banner: z.number().nullable().optional(),
  kr_banner_url: z.string().nullable().optional(),
  en_banner_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  visibility: z
    .enum(['public', 'private', 'unlisted'], {
      message: 'Visibility must be a public, private, or unlisted.',
    })
    .optional(),
  views: z
    .number()
    .min(1, {
      message: `Views must be at least 1`,
    })
    .optional(),
  updated_at: z.string().datetime().optional(),
  years: z.number().optional(),
  months: z.number().optional(),
  days: z.number().optional(),
  hours: z.number().optional(),
  minutes: z.number().optional(),
  seconds: z.number().optional(),
  message: z.string().optional(),
});

export const DeckFindResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: DeckFindResponseDataSchema,
});
