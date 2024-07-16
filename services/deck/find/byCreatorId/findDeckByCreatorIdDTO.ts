import { z } from "zod";
import { DeckFindRequestByCreatorIdSchema, DeckFindResponseByCreatorIdDataSchema, DeckFindResponseByCreatorIdSchema } from "./findDeckByCreatorIdSchema";

type DeckFindRequestByCreatorIdDTO = z.infer<typeof DeckFindRequestByCreatorIdSchema>;
type DeckFindResponseByCreatorIdDataDTO = z.infer<typeof DeckFindResponseByCreatorIdDataSchema>;
type DeckFindResponseByCreatorIdDTO = z.infer<typeof DeckFindResponseByCreatorIdSchema>;

export type {DeckFindRequestByCreatorIdDTO, DeckFindResponseByCreatorIdDataDTO, DeckFindResponseByCreatorIdDTO}
