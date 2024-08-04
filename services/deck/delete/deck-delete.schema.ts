import { z } from 'zod';
export const DeckDeleteRequestSchema = z.object({
  // @IsNotEmpty()
  // @IsUUID()
  id: z.string().uuid({ message: `Id must be a valid UUID` }),
});

export const DeckDeleteResponseDataSchema = z.object({
  isDeleted: z.boolean().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const DeckDeleteResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: DeckDeleteResponseDataSchema,
});
