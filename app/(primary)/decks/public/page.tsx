import { DeckSearchBar } from "@/components/decksearch/DeckSearchBar";
import DeckSearchResults from "@/components/decksearch/DeckSearchResults";

export default async function PublicDecks({
  searchParams,
}: {
  searchParams?: {
    name?: string;
    page?: string;
  };
}) {
  const name = searchParams?.name || '';
  const currentPage = Number(searchParams?.page) || 1;
    return (
      <div>
        Deck Search
        <DeckSearchBar />
        <DeckSearchResults name={name}/>
      </div>
    );
  }
  