import { z } from "zod";
import { DeckSearchBarSchema, DeckFindCustomRequestSchema, DeckFindCustomResponseDataSchema, DeckFindCustomResponseSchema } from "./deck-find-custom.schema";

type DeckSearchBarDTO = z.infer<typeof DeckSearchBarSchema>;
type DeckFindCustomRequestDTO = z.infer<typeof DeckFindCustomRequestSchema>;
type DeckFindCustomResponseDataDTO = z.infer<typeof DeckFindCustomResponseDataSchema>;
type DeckFindCustomResponseDTO = z.infer<typeof DeckFindCustomResponseSchema>;

export type {DeckSearchBarDTO, DeckFindCustomRequestDTO, DeckFindCustomResponseDataDTO, DeckFindCustomResponseDTO}
