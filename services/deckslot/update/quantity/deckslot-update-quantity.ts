"use server"
import { MakeApiRequest } from "@/services/baseApiRequest";
import { IDeckslotUpdateQuantityRequestDTO, IDeckslotUpdateQuantityResponseDataDTO } from "./deckslot-update-quantity.dto";
import { IDeckslotUpdateQuantityRequestSchema, IDeckslotUpdateQuantityResponseDataSchema, IDeckslotUpdateQuantityResponseSchema } from "./deckslot-update-quantity.schema";
import { validate } from "@/utils/schemaValidator";

export async function UpdateDeckSlotQuantity(payload: IDeckslotUpdateQuantityRequestDTO): Promise<IDeckslotUpdateQuantityResponseDataDTO>{
    const deckSlotUpdateUrl = process.env.BACKEND_URL + "/deckslot/update/quantity";
    // console.log("deckSlotUpdateUrl: ", deckSlotUpdateUrl)
    const deckSlotUpdateResponse = await MakeApiRequest({
      url: deckSlotUpdateUrl,
      method: 'PATCH',
      requestSchema: IDeckslotUpdateQuantityRequestSchema,
      responseSchema: IDeckslotUpdateQuantityResponseSchema,
      data: payload
    });
    // console.log("raw deckSlotUpdateResponse: ", deckSlotUpdateResponse.data);
    const validatedRes: IDeckslotUpdateQuantityResponseDataDTO = validate(deckSlotUpdateResponse.data, IDeckslotUpdateQuantityResponseDataSchema, "IDeckslotUpdateQuantityResponseDataSchema");
    // console.log("validated deckSlotUpdateResponse: ", validatedRes);
    return validatedRes;
}   
