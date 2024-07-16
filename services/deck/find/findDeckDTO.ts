import { z } from "zod";
import { DeckFindRequestSchema, DeckFindResponseSchema, DeckFindResponseDataSchema } from "./findDeckSchema"

type DeckFindRequestDTO = z.infer<typeof DeckFindRequestSchema>;
type DeckFindResponseDTO = z.infer<typeof DeckFindResponseSchema>;
type DeckFindResponseDataDTO = z.infer<typeof DeckFindResponseDataSchema>;

export type { DeckFindRequestDTO, DeckFindResponseDTO, DeckFindResponseDataDTO }