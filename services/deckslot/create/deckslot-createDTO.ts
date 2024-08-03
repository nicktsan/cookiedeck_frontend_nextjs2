import { z } from 'zod';
import {
  DeckslotCreateRequestSchema,
  DeckslotCreateResponseDataSchema,
  DeckslotCreateResponseSchema,
} from './deckslot-create.schema';

type DeckslotCreateRequestDTO = z.infer<typeof DeckslotCreateRequestSchema>;
type DeckslotCreateResponseDataDTO = z.infer<typeof DeckslotCreateResponseDataSchema>;
type DeckslotCreateResponseDTO = z.infer<typeof DeckslotCreateResponseSchema>;

export type { DeckslotCreateRequestDTO, DeckslotCreateResponseDataDTO, DeckslotCreateResponseDTO };
