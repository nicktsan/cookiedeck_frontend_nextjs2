import { MakeApiRequest } from "@/services/baseApiRequest";
import { DeckFindRequestDTO, DeckFindResponseDTO, DeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import { DeckFindRequestSchema, DeckFindResponseSchema, DeckFindResponseDataSchema } from "@/services/deck/find/findDeckSchema";
import { validate } from "@/utils/schemaValidator";
import DeckInfo from "@/components/DeckInfo";
import CardSearch from "@/components/CardSearch";
import {DeckslotFindByDeckIdRequestDTO, DeckslotFindByDeckIdResponseDataDTO, DeckslotFindByDeckIdResponseDTO} from "@/services/deckslot/find/bydeckId/deckslot-find-bydeckid.dto"
import {DeckslotFindByDeckIdRequestSchema, DeckslotFindByDeckIdResponseDataSchema, DeckslotFindByDeckIdResponseSchema} from "@/services/deckslot/find/bydeckId/deckslot-find-bydeckid.schema"
import DeckSlotDisplay from "@/components/DeckSlotDisplay";
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";

export default async function DeckView({ params }: { params: { id: string } }) {
  const deckFindUrl = process.env.BACKEND_URL + "/deck/find";
  const deckFindRequestData: DeckFindRequestDTO = {
      id: params.id
  }
  const deckSlotFindUrl = process.env.BACKEND_URL + "/deckslot/find/bydeckid";
  const deckSlotFindRequestData: DeckslotFindByDeckIdRequestDTO = {
    deck_id: params.id
  }
  const [deckFindResponse, deckSlotFindResponse] = await Promise.all([
    MakeApiRequest({
      url: deckFindUrl,
      method: 'GET',
      requestSchema: DeckFindRequestSchema,
      responseSchema: DeckFindResponseSchema,
      data: deckFindRequestData
    }),
    MakeApiRequest({
      url: deckSlotFindUrl,
      method: 'GET',
      requestSchema: DeckslotFindByDeckIdRequestSchema,
      responseSchema: DeckslotFindByDeckIdResponseSchema,
      data: deckSlotFindRequestData
    })
  ]);
  validate(deckFindResponse.data, DeckFindResponseDataSchema, "DeckFindResponseDataSchema");
  validate(deckSlotFindResponse.data, DeckslotFindByDeckIdResponseDataSchema, "DeckslotFindByDeckIdResponseDataSchema");
  let displayDeck: DeckFindResponseDataDTO | undefined = undefined;
  let deckSlots: DeckslotFindResponseDTO[] | undefined | null= [];
  if (!deckFindResponse.data.error && deckFindResponse.data.id) {
    displayDeck = deckFindResponse.data
  }
  if (!deckSlotFindResponse.data.error && deckSlotFindResponse.data.deckslots) {
    deckSlots = deckSlotFindResponse.data.deckslots
  }
  if (!displayDeck) {
    // console.log(deckFindResponse.data.error)
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
    <div>
      <DeckInfo displayDeck={displayDeck}/>
      <CardSearch deckId={params.id}/>
      <DeckSlotDisplay deckslots={deckSlots}/>
    </div>
  );
}
