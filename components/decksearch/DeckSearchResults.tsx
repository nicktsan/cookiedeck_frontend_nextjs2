import { DeckEntity } from "@/services/deck/deck.entity";
import { DeckFindCustom } from "@/services/deck/find/custom/deck-find-custom";
import Link from "next/link";

export default async function DeckSearchResults({
    name,
    // currentPage,
  }: {
    name: string;
    // currentPage: number;
  }) {
    let decks: DeckEntity[] = []
    if (name.trim().length > 2) {
        const deckFindRes = await DeckFindCustom(name);
        // console.log("deckFindRes: ", deckFindRes)
        if (deckFindRes.decks){
            decks = deckFindRes.decks as DeckEntity[];
            return (
                <div>
                  {decks.map((deck) => (
                    <Link key={deck.id} href={`/deck/${deck.id}`}>
                      <div className="my-2 outline outline-offset-2 outline-blue-500 cursor-pointer">
                        <h2>Deck Name: {deck.name}</h2>
                        <h2>Creator: {deck.username}</h2>
                        <p>Views: {deck.views}</p>
                        <p>Last Updated: {deck.updated_at}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              );
        }
    }
    return (
        <div>
          No decks found.
        </div>
      );
  }