import { DeckSearchBar } from '@/components/decksearch/DeckSearchBar';
import DeckSearchResults from '@/components/decksearch/DeckSearchResults';

export default async function PublicDecks({
  searchParams,
}: {
  searchParams?: {
    name?: string;
    page?: string;
  };
}) {
  const name = searchParams?.name || '';
  return (
    <div className="flex flex-1 flex-col items-center gap-y-4">
      Deck Search
      <DeckSearchBar />
      <DeckSearchResults name={name} />
    </div>
  );
}
