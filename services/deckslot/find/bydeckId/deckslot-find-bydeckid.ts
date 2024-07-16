"use server"
import { MakeApiRequest } from "@/services/baseApiRequest";
import { DeckslotFindByDeckIdRequestDTO, DeckslotFindByDeckIdResponseDataDTO } from "./deckslot-find-bydeckid.dto";
import { DeckslotFindByDeckIdRequestSchema, DeckslotFindByDeckIdResponseDataSchema, DeckslotFindByDeckIdResponseSchema } from "./deckslot-find-bydeckid.schema";
import { validate } from "@/utils/schemaValidator";

export async function DeckSlotFindByDeckId(id: string): Promise<DeckslotFindByDeckIdResponseDataDTO>{
    const deckSlotFindUrl = process.env.BACKEND_URL + "/deckslot/find/bydeckid";
    const deckSlotFindRequestData: DeckslotFindByDeckIdRequestDTO = { deck_id: id };
    // console.log("deckSlotFindUrl: ", deckSlotFindUrl)
    const deckSlotFindResponse = await MakeApiRequest({
      url: deckSlotFindUrl,
      method: 'GET',
      requestSchema: DeckslotFindByDeckIdRequestSchema,
      responseSchema: DeckslotFindByDeckIdResponseSchema,
      data: deckSlotFindRequestData
    });
    // console.log("raw deckSlotFindResponse: ", deckSlotFindResponse.data);
    const validatedRes: DeckslotFindByDeckIdResponseDataDTO = validate(deckSlotFindResponse.data, DeckslotFindByDeckIdResponseDataSchema, "DeckslotFindByDeckIdResponseDataSchema");
    // console.log("validated deckSlotFindResponse: ", validatedRes);
    return validatedRes;
}   
