import { z } from 'zod';
import {
  DeckUpdateRequestSchema,
  DeckUpdateResponseSchema,
  DeckUpdateResponseDataSchema,
} from './deck-update.schema';

type DeckUpdateRequestDTO = z.infer<typeof DeckUpdateRequestSchema>;
type DeckUpdateResponseDTO = z.infer<typeof DeckUpdateResponseSchema>;
type DeckUpdateResponseDataDTO = z.infer<typeof DeckUpdateResponseDataSchema>;

export type { DeckUpdateRequestDTO, DeckUpdateResponseDTO, DeckUpdateResponseDataDTO };
