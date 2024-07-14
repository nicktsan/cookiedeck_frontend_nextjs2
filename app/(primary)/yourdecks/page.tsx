import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { IDeckFindRequestByCreatorIdSchema, IDeckFindResponseByCreatorIdSchema } from "@/services/deck/find/byCreatorId/findDeckByCreatorIdSchema";
import { MakeApiRequest } from "@/services/baseApiRequest";
import { z } from "zod";
import { DeckEntity } from "@/services/deck/deck.entity";
import Link from "next/link";
export default async function YourDecks() {
    // todo
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }  
    const url = process.env.BACKEND_URL + (process.env.GET_CREATOR_BY_ID_PATH ?? "/deck/find/bycreatorid")
    // creator_id: z.string().uuid({
	// 	message: `creator_id must be a valid UUID`,
	// }),
	// nameOrderDirection: z.enum(["asc", "desc"], {
	// 	message: `nameOrderDirection must be 'asc' or 'desc'`,
	// }).optional(),
	// updatedAtOrderDirection: z.enum(["asc", "desc"], {
	// 	message: `updatedAtOrderDirection must be 'asc' or 'desc'`,
	// }).optional(),
    const params: z.infer<typeof IDeckFindRequestByCreatorIdSchema> = {
        creator_id: user.id,
        nameOrderDirection: "asc",
    }
    const res: z.infer<typeof IDeckFindResponseByCreatorIdSchema> = await MakeApiRequest({
        url,
        method: 'GET',
        requestSchema: IDeckFindRequestByCreatorIdSchema,
        responseSchema: IDeckFindResponseByCreatorIdSchema,
        data: params
    });
    let yourDecks: z.infer<typeof DeckEntity>[] | null | undefined = []
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
    