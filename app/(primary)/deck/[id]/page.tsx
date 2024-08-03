'use client';
import { useState, useEffect, useCallback } from 'react';
import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';
import DeckInfo from '@/components/deckpage/DeckInfo';
import CardSearch from '@/components/deckpage/CardSearch';
import DeckSlotDisplay from '@/components/deckpage/DeckSlotDisplay';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';
import { FindDeck } from '@/services/deck/find/findDeck';
import { DeckSlotFindByDeckId } from '@/services/deckslot/find/bydeckId/deckslot-find-bydeckid';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DeckPageFooter from '@/components/deckpage/DeckPageFooter';
import { DeckPageDropDownMenu } from '@/components/deckpage/DeckPageDropDownMenu';

export default function DeckView({ params }: { params: { id: string } }) {
  const [displayDeck, setDisplayDeck] = useState<DeckFindResponseDataDTO | undefined>(undefined);
  const [deckSlots, setDeckSlots] = useState<DeckslotFindResponseDTO[] | undefined | null>([]);
  const [viewMode, setViewMode] = useState<'en' | 'kr'>('en');

  const fetchDeckData = useCallback(async () => {
    const deckFindResponse: DeckFindResponseDataDTO = await FindDeck(params.id);
    // console.log("deckFindResponse: ", deckFindResponse);
    if (!deckFindResponse.error && deckFindResponse.id) {
      setDisplayDeck(deckFindResponse);
    }
  }, [params.id]);
  const fetchDeckSlots = useCallback(async () => {
    const deckSlotFindResponse = await DeckSlotFindByDeckId(params.id);
    // console.log("deckSlotFindResponse: ", deckSlotFindResponse);
    if (!deckSlotFindResponse.error && deckSlotFindResponse.deckslots) {
      setDeckSlots(deckSlotFindResponse.deckslots);
    }
  }, [params.id]);

  useEffect(() => {
    fetchDeckData();
    fetchDeckSlots();
  }, [fetchDeckData, fetchDeckSlots]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'en' ? 'kr' : 'en'));
  };
  // todo loading state
  if (!displayDeck) {
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <div className="w-full">
          <div className="py-6 text-center font-bold">Deck not found for {params.id}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {' '}
      {/* Add this wrapper */}
      <div className="flex-grow pb-32">
        {' '}
        {/* Add padding-bottom to prevent content from being hidden behind the footer */}
        <DeckInfo displayDeck={displayDeck} />
        <div className="mb-4 flex items-center justify-center space-x-2">
          <DeckPageDropDownMenu deckId={params.id}/>
          <Switch id="view-mode" onCheckedChange={toggleViewMode} />
          <Label htmlFor="view-mode">{viewMode === 'en' ? 'EN' : 'KR'}</Label>
          <CardSearch
            deckId={params.id}
            onUpdate={() => {
              fetchDeckSlots(), fetchDeckData();
            }}
            viewMode={viewMode}
          />
        </div>
        <DeckSlotDisplay
          deckslots={deckSlots}
          onUpdate={() => {
            fetchDeckSlots(), fetchDeckData();
          }}
          viewMode={viewMode}
        />
        <DeckPageFooter deckslots={deckSlots} />
      </div>
    </div>
  );
}
