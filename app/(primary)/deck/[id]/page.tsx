'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { IncrementDeckView } from '@/services/deck/update/incrementview/incrementDeckView';
import { createClient } from '@/utils/supabase/client';

export default function DeckView({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [viewMode, setViewMode] = useState<'en' | 'kr'>('en');
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isUserAuthenticated } = useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    retry: false, // No retries for PATCH request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });

  const { data: patchResponse, isLoading: isPatchLoading } = useQuery({
    queryKey: ['patchDeck', params.id],
    queryFn: () => IncrementDeckView({ id: params.id }),
    retry: false, // No retries for PATCH request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });

  const { data: displayDeck, isLoading: isDeckLoading } = useQuery<DeckFindResponseDataDTO>({
    queryKey: ['deck', params.id],
    queryFn: () => FindDeck(params.id),
    retry: 3,
    refetchOnWindowFocus: false, // Avoid refetch on window focus
    enabled: !!patchResponse, // Only run if PATCH request is successful
  });

  const { data: deckSlots, isLoading: isDeckSlotsLoading } = useQuery<DeckslotFindResponseDTO[]>({
    queryKey: ['deckSlots', params.id],
    queryFn: async () => {
      const response = await DeckSlotFindByDeckId(params.id);
      return response.deckslots || [];
    },
    retry: 3,
    refetchOnWindowFocus: false, // Avoid refetch on window focus
    enabled: !!patchResponse, // Only run if PATCH request is successful
  });

  const updateDeckMutation = useMutation({
    mutationFn: FindDeck,
    onSuccess: (data) => {
      queryClient.setQueryData(['deck', params.id], data);
    },
  });

  const updateDeckSlotsMutation = useMutation({
    mutationFn: DeckSlotFindByDeckId,
    onSuccess: (data) => {
      queryClient.setQueryData(['deckSlots', params.id], data.deckslots || []);
    },
  });

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'en' ? 'kr' : 'en'));
  };

  if (isPatchLoading || isDeckLoading || isDeckSlotsLoading || isUserAuthenticated) {
    //todo allow child components to load separately if they are successfully found
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <div className="w-full">
          <div className="py-6 text-center font-bold">Loading deck...</div>
        </div>
      </div>
    );
  }

  if (!displayDeck) {
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <div className="w-full">
          <div className="py-6 text-center font-bold">Deck not found for {params.id}</div>
        </div>
      </div>
    );
  }

  const isOwner: boolean | null | undefined = userData && userData.id === displayDeck.creator_id;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow pb-32">
        <DeckInfo
          displayDeck={displayDeck}
          onUpdate={() => updateDeckMutation.mutate(params.id)}
          isOwner={isOwner}
        />
        <div className="my-4 flex items-center justify-center space-x-2">
          {isOwner && <DeckPageDropDownMenu deckId={params.id} />}
          <Switch id="view-mode" onCheckedChange={toggleViewMode} />
          <Label htmlFor="view-mode">{viewMode === 'en' ? 'EN' : 'KR'}</Label>
          {isOwner && <CardSearch deckId={params.id} viewMode={viewMode} />}
        </div>
        <DeckSlotDisplay
          deckslots={deckSlots || []}
          onUpdate={() => [
            updateDeckSlotsMutation.mutate(params.id),
            updateDeckMutation.mutate(params.id),
          ]}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isOwner={isOwner}
        />
        <DeckPageFooter deckslots={deckSlots || []} />
      </div>
    </div>
  );
}
