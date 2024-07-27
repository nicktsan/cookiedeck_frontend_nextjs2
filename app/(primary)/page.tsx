import { DeckSearchBar } from "@/components/decksearch/DeckSearchBar";

export default async function Index() {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <DeckSearchBar />
    </div>
  );
}
