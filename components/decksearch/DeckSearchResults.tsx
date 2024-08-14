import { DeckEntity } from '@/services/deck/deck.entity';
import { DeckFindCustom } from '@/services/deck/find/custom/deck-find-custom';
import { DeckFindCustomResponseDataDTO } from '@/services/deck/find/custom/deck-find-custom.dto';
import { ErrorResponseDataDTO } from '@/utils/error.schema';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';

export default async function DeckSearchResults({
  name,
  // currentPage,
}: {
  name: string;
  // currentPage: number;
}) {
  let decks: DeckEntity[] = [];
  // Type guard to check if the response is DeckFindCustomResponseDataDTO
  function isDeckFindCustomResponseDataDTO(
    response: any,
  ): response is DeckFindCustomResponseDataDTO {
    return (
      (response as DeckFindCustomResponseDataDTO).decks !== undefined ||
      (response as DeckFindCustomResponseDataDTO).decks !== null
    );
  }

  // Type guard to check if the response is ErrorResponseDataDTO
  function isErrorResponseDataDTO(response: any): response is ErrorResponseDataDTO {
    return (
      (response as ErrorResponseDataDTO).error !== undefined ||
      (response as ErrorResponseDataDTO).DTO !== undefined ||
      (response as ErrorResponseDataDTO).errorCode !== undefined
    );
  }
  if (name.trim().length > 2) {
    const deckFindRes: DeckFindCustomResponseDataDTO | ErrorResponseDataDTO =
      await DeckFindCustom(name);
    if (isDeckFindCustomResponseDataDTO(deckFindRes)) {
      if (deckFindRes.decks) {
        decks = deckFindRes.decks as DeckEntity[];
        return (
          <div className="grid grid-cols-4 gap-4">
            {decks.map((deck) => (
              <Link key={deck.id} href={`/deck/${deck.id}`}>
                <div className="cursor-pointer outline outline-offset-2 outline-blue-500">
                  <h2>{deck.name}</h2>
                  <h2>{deck.username}</h2>
                  <div className="flex items-center gap-x-1">
                    <FaEye /> <p>{deck.views}</p>
                  </div>
                  <p>Last Updated: {deck.updated_at}</p>
                </div>
              </Link>
            ))}
          </div>
        );
      }
    } else if (isErrorResponseDataDTO(deckFindRes)) {
      // console.log(deckFindRes.message || deckFindRes.errorMessage);
      if (deckFindRes.DTO) {
        // console.log(deckFindRes.DTO);
      }
    } else {
      console.error('Unknown response type:', deckFindRes);
    }
  }
  if (!name) {
    return null;
  }
  return <div>No decks found.</div>;
}
