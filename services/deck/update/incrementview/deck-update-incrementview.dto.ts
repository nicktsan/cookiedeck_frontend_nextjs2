import { z } from 'zod';
import {
  DeckUpdateIncrementviewRequestSchema,
  DeckUpdateIncrementviewResponseSchema,
  DeckUpdateIncrementviewResponseDataSchema,
} from './deck-update-incrementview.schema';

type DeckUpdateIncrementviewRequestDTO = z.infer<typeof DeckUpdateIncrementviewRequestSchema>;
type DeckUpdateIncrementviewResponseDTO = z.infer<typeof DeckUpdateIncrementviewResponseSchema>;
type DeckUpdateIncrementviewResponseDataDTO = z.infer<typeof DeckUpdateIncrementviewResponseDataSchema>;

export type { DeckUpdateIncrementviewRequestDTO, DeckUpdateIncrementviewResponseDTO, DeckUpdateIncrementviewResponseDataDTO };
