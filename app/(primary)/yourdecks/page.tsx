import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DeckFindRequestByCreatorIdSchema, DeckFindResponseByCreatorIdDataSchema, DeckFindResponseByCreatorIdSchema } from "@/services/deck/find/byCreatorId/findDeckByCreatorIdSchema";
import { DeckFindRequestByCreatorIdDTO, DeckFindResponseByCreatorIdDataDTO, DeckFindResponseByCreatorIdDTO } from "@/services/deck/find/byCreatorId/findDeckByCreatorIdDTO"
import { MakeApiRequest } from "@/services/baseApiRequest";
import { DeckEntity } from "@/services/deck/deck.entity";
import Link from "next/link";
import { ValidateSchema } from "@/utils/schemaValidator";
export default async function YourDecks() {
    function validate(dto: unknown): DeckFindResponseByCreatorIdDataDTO {
        return ValidateSchema({ dto, schema: DeckFindResponseByCreatorIdDataSchema, schemaName: "DeckFindResponseByCreatorIdDataSchema" });
    }

    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }  
    const url = process.env.BACKEND_URL + (process.env.GET_CREATOR_BY_ID_PATH ?? "/deck/find/bycreatorid")
    const params: DeckFindRequestByCreatorIdDTO = {
        creator_id: user.id,
        nameOrderDirection: "asc",
    }
    const res: DeckFindResponseByCreatorIdDTO = await MakeApiRequest({
        url,
        method: 'GET',
        requestSchema: DeckFindRequestByCreatorIdSchema,
        responseSchema: DeckFindResponseByCreatorIdSchema,
        data: params
    });
    validate(res.data)
    let yourDecks: DeckEntity[] = []
    if (!res.data.error && res.data.decks) {
        yourDecks = res.data.decks
    }
    return (
        <div className="flex-1 flex flex-col gap-20 items-center">
            Your Decks  
            {yourDecks?.map(yourDeck => (
                <div>
                    <Link className="text-blue-500 hover:underline text-center" key={yourDeck.id} href={`/deck/${yourDeck.id}`}>
                        {yourDeck.name || 'Unnamed Deck'}
                    </Link>
                    <p>{yourDeck.updated_at}</p>
                </div>
            ))}
        </div>
    );
}
    