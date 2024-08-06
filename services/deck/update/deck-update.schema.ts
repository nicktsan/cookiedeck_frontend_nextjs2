import { z } from 'zod';
import { DeckEntitySchema } from '../deck.entity';
export const DeckUpdateRequestSchema = z.object({
  id: z.string().uuid({
    message: 'Id must be a valid UUID.',
  }),
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters long.',
    })
    .optional(),
  folder_id: z
    .string()
    .uuid({
      message: 'Folder_id must be a valid UUID.',
    })
    .nullable()
    .optional(),
  banner: z
    .number({
      message: 'Banner must be a number.',
    })
    .nullable()
    .optional(),
  description: z.string().nullable().optional(),
  visibility: z
    .enum(['public', 'private', 'unlisted'], {
      message: 'Visibility must be a public, private, or unlisted.',
    })
    .optional(),
});

export const DeckUpdateResponseDataSchema = z.object({
  deckEntity: DeckEntitySchema.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  //DTO validation failure from the backend
  errorCode: z.number().min(100).max(599).optional(),
  errorMessage: z.string().optional(),
  DTO: z
    .array(
      z.object({
        property: z.string(),
        messages: z.array(z.string()),
      }),
    )
    .optional(),
});

export const DeckUpdateResponseSchema = z.object({
  statusCode: z
    .number({
      required_error: 'statusCode is required',
    })
    .min(100)
    .max(599),
  data: DeckUpdateResponseDataSchema,
});
