import { z } from 'zod';
import {
  DeckDeleteRequestSchema,
  DeckDeleteResponseDataSchema,
  DeckDeleteResponseSchema,
} from './deck-delete.schema';
type DeckDeleteRequestDTO = z.infer<typeof DeckDeleteRequestSchema>;
type DeckDeleteResponseDataDTO = z.infer<typeof DeckDeleteResponseDataSchema>;
type DeckDeleteResponseDTO = z.infer<typeof DeckDeleteResponseSchema>;

export type { DeckDeleteRequestDTO, DeckDeleteResponseDataDTO, DeckDeleteResponseDTO };
