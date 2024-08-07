import { z } from 'zod';
import {
  DeckslotDeleteRequestSchema,
  DeckslotDeleteResponseDataSchema,
  DeckslotDeleteResponseSchema,
} from './deckslot-delete.schema';

type DeckslotDeleteRequestDTO = z.infer<typeof DeckslotDeleteRequestSchema>;
type DeckslotDeleteResponseDataDTO = z.infer<typeof DeckslotDeleteResponseDataSchema>;
type DeckslotDeleteResponseDTO = z.infer<typeof DeckslotDeleteResponseSchema>;

export type { DeckslotDeleteRequestDTO, DeckslotDeleteResponseDataDTO, DeckslotDeleteResponseDTO };
