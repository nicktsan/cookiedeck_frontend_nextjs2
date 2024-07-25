import { z } from "zod";
import { IDeckslotUpdateQuantityRequestSchema, IDeckslotUpdateQuantityResponseDataSchema, IDeckslotUpdateQuantityResponseSchema } from "./deckslot-update-quantity.schema";

type IDeckslotUpdateQuantityRequestDTO = z.infer<typeof IDeckslotUpdateQuantityRequestSchema>;
type IDeckslotUpdateQuantityResponseDataDTO = z.infer<typeof IDeckslotUpdateQuantityResponseDataSchema>;
type IDeckslotUpdateQuantityResponseDTO = z.infer<typeof IDeckslotUpdateQuantityResponseSchema>;

export type {IDeckslotUpdateQuantityRequestDTO, IDeckslotUpdateQuantityResponseDataDTO, IDeckslotUpdateQuantityResponseDTO}
