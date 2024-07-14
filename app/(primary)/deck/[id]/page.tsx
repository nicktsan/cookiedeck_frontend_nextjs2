import { MakeApiRequest } from "@/services/baseApiRequest";
import { IDeckFindRequestDTO, IDeckFindResponseDTO, IDeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import { IDeckFindRequestSchema, IDeckFindResponseSchema, IDeckFindResponseDataSchema } from "@/services/deck/find/findDeckSchema";
import { ValidateSchema } from "@/utils/schemaValidator";
import DeckInfo from "@/components/DeckInfo";

export default async function DeckView({ params }: { params: { id: string } }) {
  function validate(dto: unknown): IDeckFindResponseDataDTO {
    return ValidateSchema({ dto, schema: IDeckFindResponseDataSchema, schemaName: "IDeckFindResponseDataSchema" });
  }
  
  const url = process.env.BACKEND_URL + "/deck/find";
  const data: IDeckFindRequestDTO = {
      id: params.id
  }
  const res: IDeckFindResponseDTO = await MakeApiRequest({
      url,
      method: 'GET',
      requestSchema: IDeckFindRequestSchema,
      responseSchema: IDeckFindResponseSchema,
      data: data
  });
  validate(res.data)
  let displayDeck: IDeckFindResponseDataDTO | undefined = undefined;
  if (!res.data.error && res.data.id) {
    displayDeck = res.data
  }
  if (!displayDeck) {
    // console.log(res.data.error)
    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          <div className="py-6 font-bold text-center">
            Deck not found for {params.id}
          </div>
        </div>
      </div>
    )
  }
  return (
    <DeckInfo displayDeck={displayDeck}/>
  );
}
