import {z} from "zod";

export const DeckUpdateIncrementviewRequestSchema = z.object({
    id: z.string().uuid({
        message: 'id must be a valid UUID.'
    })
});

export const DeckUpdateIncrementviewResponseDataSchema = z.object({
    id: z.string().uuid({
        message: 'id must be a valid UUID.'
    }).optional(),
    message: z.string().optional()
});


export const DeckUpdateIncrementviewResponseSchema = z.object({
statusCode: z
    .number({
    required_error: 'statusCode is required',
    })
    .min(100)
    .max(599),
data: DeckUpdateIncrementviewResponseDataSchema,
});
  