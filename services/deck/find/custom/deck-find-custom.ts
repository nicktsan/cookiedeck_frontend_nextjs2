"use server"
import { MakeApiRequest } from "@/services/baseApiRequest";
import { DeckFindCustomRequestDTO, DeckFindCustomResponseDataDTO } from "./deck-find-custom.dto";
import { DeckFindCustomRequestSchema, DeckFindCustomResponseDataSchema, 
    DeckFindCustomResponseSchema } from "./deck-find-custom.schema";
import { validate } from "@/utils/schemaValidator";

export async function DeckFindCustom(name: string): Promise<DeckFindCustomResponseDataDTO> {
    const deckFindCustomUrl = process.env.BACKEND_URL + "/deck/find/custom";
    const deckFindCustomRequestData: DeckFindCustomRequestDTO = {
      select: ["name", "views", "username", "updated_at"],
      name: name,
    };
    // console.log("deckFindCustomUrl: ", deckFindCustomUrl)
    const deckFindCustomResponse = await MakeApiRequest({
      url: deckFindCustomUrl,
      method: 'POST',
      requestSchema: DeckFindCustomRequestSchema,
      responseSchema: DeckFindCustomResponseSchema,
      data: deckFindCustomRequestData
    });
    // console.log("deckFindCustomResponse: ", deckFindCustomResponse);
    // console.log("raw deckFindCustomResponse: ", deckFindCustomResponse);
    const validated: DeckFindCustomResponseDataDTO = validate(deckFindCustomResponse.data, DeckFindCustomResponseDataSchema, "DeckFindCustomResponseDataSchema");
    // console.log("validated deckFindCustomResponse: ", validated);
    return validated
}