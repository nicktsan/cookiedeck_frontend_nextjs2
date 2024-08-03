import { z } from 'zod';
import {
  DeckslotUpdateQuantityRequestSchema,
  DeckslotUpdateQuantityResponseDataSchema,
  DeckslotUpdateQuantityResponseSchema,
} from './deckslot-update-quantity.schema';

type DeckslotUpdateQuantityRequestDTO = z.infer<typeof DeckslotUpdateQuantityRequestSchema>;
type DeckslotUpdateQuantityResponseDataDTO = z.infer<
  typeof DeckslotUpdateQuantityResponseDataSchema
>;
type DeckslotUpdateQuantityResponseDTO = z.infer<typeof DeckslotUpdateQuantityResponseSchema>;

export type {
  DeckslotUpdateQuantityRequestDTO,
  DeckslotUpdateQuantityResponseDataDTO,
  DeckslotUpdateQuantityResponseDTO,
};
