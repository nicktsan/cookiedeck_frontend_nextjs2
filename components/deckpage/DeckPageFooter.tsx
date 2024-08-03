import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

interface DeckInfoProps {
  deckslots: DeckslotFindResponseDTO[] | undefined | null;
}

export default function DeckPageFooter({ deckslots }: DeckInfoProps) {
  const deckCount: number = deckslots?.reduce((sum, card) => sum + card.quantity!, 0) || 0;
  const flipCount: number =
    deckslots?.reduce((sum, card) => {
      if (card.plain_text_eng?.includes('[FLIP]')) {
        return sum + (card.quantity ?? 0);
      }
      return sum;
    }, 0) ?? 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4">
      {deckCount}/60 cards, {flipCount}/16 flip cards.
    </div>
  );
}
