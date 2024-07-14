import { z } from "zod";
import { IDeckFindRequestSchema, IDeckFindResponseSchema, IDeckFindResponseDataSchema } from "./findDeckSchema"

type IDeckFindRequestDTO = z.infer<typeof IDeckFindRequestSchema>;
type IDeckFindResponseDTO = z.infer<typeof IDeckFindResponseSchema>;
type IDeckFindResponseDataDTO = z.infer<typeof IDeckFindResponseDataSchema>;

export type { IDeckFindRequestDTO, IDeckFindResponseDTO, IDeckFindResponseDataDTO }