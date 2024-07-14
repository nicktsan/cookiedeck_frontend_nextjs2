import { z } from "zod";
import { IDeckFindRequestByCreatorIdSchema, IDeckFindResponseByCreatorIdDataSchema, IDeckFindResponseByCreatorIdSchema } from "./findDeckByCreatorIdSchema";

type IDeckFindRequestByCreatorIdDTO = z.infer<typeof IDeckFindRequestByCreatorIdSchema>;
type IDeckFindResponseByCreatorIdDataDTO = z.infer<typeof IDeckFindResponseByCreatorIdDataSchema>;
type IDeckFindResponseByCreatorIdDTO = z.infer<typeof IDeckFindResponseByCreatorIdSchema>;

export type {IDeckFindRequestByCreatorIdDTO, IDeckFindResponseByCreatorIdDataDTO, IDeckFindResponseByCreatorIdDTO}
