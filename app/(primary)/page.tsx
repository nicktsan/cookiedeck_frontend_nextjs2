import { DeckSearchBar } from '@/components/decksearch/DeckSearchBar';
import Image from 'next/image'
export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <DeckSearchBar />
    </div>
  );
}
