import { DeckEntity } from '@/services/deck/deck.entity';
import { DeckFindCustom } from '@/services/deck/find/custom/deck-find-custom';
import { DeckFindCustomResponseDataDTO } from '@/services/deck/find/custom/deck-find-custom.dto';
import { calculateSinceLastUpdate } from '@/utils/deck/calculateSinceLastUpdate';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { defaultImgURL } from '../deckpage/DeckInfo';
import Image from 'next/image';
import { colorMapping } from '@/utils/colorMapping';

export default async function DeckSearchResults({
  name,
  // currentPage,
}: {
  name: string;
  // currentPage: number;
}) {
  let decks: DeckEntity[] = [];
  //todo revalidate data after a deck is deleted
  //Add filter/sorting options for viewing, updated_at, rating, etc.

  if (name.trim().length > 2) {
    try {
      const deckFindRes: DeckFindCustomResponseDataDTO =
        await DeckFindCustom(name);
      if (deckFindRes.decks) {
        decks = deckFindRes.decks as DeckEntity[];
        return (
          <div className="grid w-11/12 grid-cols-4 gap-4 mb-4">
            {decks.map((deck) => (
              <Link key={deck.id} href={`/deck/${deck.id}`} className="h-full">
                <div className="flex h-full cursor-pointer flex-col justify-between outline outline-1 rounded">
                  <div className="relative aspect-[2/1] w-full overflow-hidden">
                    <Image
                      src={deck.image_link || defaultImgURL}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="top"
                      alt=""
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {deck.unique_colors
                      ?.slice() // Create a copy of the array to avoid mutating the original
                      .sort((a, b) => a.localeCompare(b)) // Sort the array alphabetically
                      .map((color) => (
                        <span
                          key={color}
                          title={color}
                          className="inline-flex h-6 w-6 items-center justify-center"
                        >
                          {colorMapping[color.toLowerCase() as keyof typeof colorMapping] || color}
                        </span>
                      ))}
                  </div>
                  <div className="mx-2">
                    <h2>{deck.name}</h2>
                    <h2>{deck.username}</h2>
                  </div>
                  <div className="flex flex-row flex-wrap gap-2 mx-2">
                    {deck.tag_names?.map((tag_name) => (
                      <p key={tag_name} className="max-w-full truncate hover:bg-gray-200 border-2 border-black px-2 py-1 rounded-full text-sm">
                        {tag_name}
                      </p>
                    ))}
                  </div>
                  <div className="mx-2">
                    <div className="flex items-center gap-x-1">
                      <FaEye /> <p>{deck.views}</p>
                    </div>
                    <p>{calculateSinceLastUpdate(deck)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return <p>{error.message}</p>;
      }
      return <p>Unknown error</p>
    }
  }
}
