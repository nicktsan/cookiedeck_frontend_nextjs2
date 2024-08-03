import { z } from 'zod';
import { IDeckDeleteRequestSchema, IDeckDeleteResponseDataSchema, IDeckDeleteResponseSchema} from "./deck-delete.schema"
type IDeckDeleteRequestDTO = z.infer<typeof IDeckDeleteRequestSchema>;
type IDeckDeleteResponseDataDTO = z.infer<typeof IDeckDeleteResponseDataSchema>;
type IDeckDeleteResponseDTO = z.infer<typeof IDeckDeleteResponseSchema>;

export type {
  IDeckDeleteRequestDTO,
  IDeckDeleteResponseDataDTO,
  IDeckDeleteResponseDTO,
};
