import { z } from 'zod';
import {
  DeckslotUpdateQuantityRequestSchema,
  DeckslotUpdateQuantityResponseDataSchema,
  DeckslotUpdateQuantityResponseSchema,
  DeckslotUpdateQuantityRequestNoChangeSchema,
} from './deckslot-update-quantity.schema';

type DeckslotUpdateQuantityRequestNoChangeParams = z.infer<
  typeof DeckslotUpdateQuantityRequestNoChangeSchema
>;
type DeckslotUpdateQuantityRequestDTO = z.infer<typeof DeckslotUpdateQuantityRequestSchema>;
type DeckslotUpdateQuantityResponseDataDTO = z.infer<
  typeof DeckslotUpdateQuantityResponseDataSchema
>;
type DeckslotUpdateQuantityResponseDTO = z.infer<typeof DeckslotUpdateQuantityResponseSchema>;

export type {
  DeckslotUpdateQuantityRequestNoChangeParams,
  DeckslotUpdateQuantityRequestDTO,
  DeckslotUpdateQuantityResponseDataDTO,
  DeckslotUpdateQuantityResponseDTO,
};
