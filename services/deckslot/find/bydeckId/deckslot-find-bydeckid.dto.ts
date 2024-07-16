import { z } from "zod";
import { DeckslotFindByDeckIdRequestSchema, DeckslotFindByDeckIdResponseDataSchema, DeckslotFindByDeckIdResponseSchema } from "./deckslot-find-bydeckid.schema";
import {IDTO} from "@/services/baseDTO";
type DeckslotFindByDeckIdRequestDTO = z.infer<typeof DeckslotFindByDeckIdRequestSchema>;
type DeckslotFindByDeckIdResponseDataDTO = z.infer<typeof DeckslotFindByDeckIdResponseDataSchema>;
type DeckslotFindByDeckIdResponseDTO = z.infer<typeof DeckslotFindByDeckIdResponseSchema>;

export type {DeckslotFindByDeckIdRequestDTO, DeckslotFindByDeckIdResponseDataDTO, DeckslotFindByDeckIdResponseDTO}