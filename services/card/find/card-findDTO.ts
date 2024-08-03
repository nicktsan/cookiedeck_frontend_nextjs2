import { z } from 'zod';
import {
  CardSearchRequestSchema,
  CardSearchResponseSchema,
  CardSearchResponseDataSchema,
} from './card-find.schema';
type CardSearchRequestDTO = z.infer<typeof CardSearchRequestSchema>;
type CardSearchResponseDataDTO = z.infer<typeof CardSearchResponseDataSchema>;
type CardSearchResponseDTO = z.infer<typeof CardSearchResponseSchema>;
export type { CardSearchRequestDTO, CardSearchResponseDTO, CardSearchResponseDataDTO };
