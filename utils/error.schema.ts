import { z } from 'zod';
export const ErrorResponseDataSchema = z.object({
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

export const ErrorResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: ErrorResponseDataSchema,
});

export type ErrorResponseDataDTO = z.infer<typeof ErrorResponseDataSchema>;
export type ErrorResponseDTO = z.infer<typeof ErrorResponseSchema>;
