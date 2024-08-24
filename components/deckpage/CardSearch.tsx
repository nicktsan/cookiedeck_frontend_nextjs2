'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CardSearchRequestDTO } from '@/services/card/find/card-findDTO';
import { CardSearchRequestSchema } from '@/services/card/find/card-find.schema';
import { CardFind } from '@/services/card/find/card-find';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardEntity } from '@/services/card/card.entity';
import { CreateDeckSlot } from '@/services/deckslot/create/createDeckSlot';

import { useQuery } from '@tanstack/react-query';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';
import { colorMapping } from '@/utils/colorMapping';

interface CardSearchProps {
  deckId: string | undefined;
  viewMode: 'en' | 'kr';
}

export default function CardSearch({ deckId, viewMode }: CardSearchProps) {
  const form = useForm<CardSearchRequestDTO>({
    resolver: zodResolver(CardSearchRequestSchema),
  });
  const queryClient = useQueryClient();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [scrollAreaVisible, setScrollAreaVisible] = useState(false);

  const watchedValues = form.watch(); // Use watch to get the latest form values
  const { data: cardSearchResults = [], refetch } = useQuery<CardEntity[], Error>({
    queryKey: ['cardFind', watchedValues], // Use watchedValues for the queryKey
    queryFn: () => CardFind(watchedValues), // Use watchedValues for the query function
    enabled: false, // Disable the query from automatically running
    retry: 3, // 3 retries for request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });

  const createDeckSlotMutation = useMutation({
    mutationFn: (card: CardEntity) => CreateDeckSlot(card, deckId),
    onMutate: async (card: CardEntity) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['deckSlots', deckId] });

      // Snapshot the previous value
      const previousDeckSlots = queryClient.getQueryData<DeckslotFindResponseDTO[]>([
        'deckSlots',
        deckId,
      ]);

      // Optimistically update to the new value
      if (previousDeckSlots) {
        queryClient.setQueryData<DeckslotFindResponseDTO[]>(['deckSlots', deckId], (old) => {
          const existingSlot = old?.find(
            (slot) => slot.card_id === card.id && slot.board === 'main',
          );
          if (existingSlot) {
            // If the card already exists, increase its quantity
            return old?.map((slot) =>
              slot.card_id === card.id && slot.board === 'main'
                ? { ...slot, quantity: (slot.quantity || 0) + 1 }
                : slot,
            );
          } else {
            // If it's a new card, add it to the deck
            const newSlot: DeckslotFindResponseDTO = {
              deck_id: deckId!,
              card_id: card.id,
              board: 'main',
              quantity: 1,
              name_eng: card.name_eng,
              name_kr: card.name_kr,
              color: card.color,
              card_type: card.card_type,
              image_link: card.image_link,
              plain_text_eng: card.plain_text_eng,
              code: card.code,
            };
            return [...(old || []), newSlot];
          }
        });
      }

      return { previousDeckSlots };
    },
    onError: (err, newCard, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['deckSlots', deckId], context?.previousDeckSlots);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['deckSlots', deckId] });
      queryClient.invalidateQueries({ queryKey: ['deck', deckId] });
    },
  });

  const handleInputChange = () => {
    setScrollAreaVisible(false);
  };

  const handleCardClick = async (card: CardEntity) => {
    createDeckSlotMutation.mutate(card);
  };

  const onSubmit = async () => {
    setSearchPerformed(true);
    await refetch();
    setScrollAreaVisible(true);
  };

  // Handle click outside the component
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.card-search-container')) {
      setScrollAreaVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate scroll area height
  const scrollAreaHeight = cardSearchResults.length * 48; // Each item is 48px tall
  const maxHeight = 288; // Maximum height
  const calculatedHeight = Math.min(scrollAreaHeight, maxHeight);

  return (
    <div className="card-search-container relative w-1/3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input
                      placeholder="Find and add cards to main deck."
                      {...field}
                      className="relative z-10"
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                  </FormControl>
                  <Button type="submit">Submit</Button>
                </div>
                {searchPerformed && cardSearchResults.length === 0 && (
                  <FormMessage className="absolute top-full z-0 mt-2 w-full text-sm text-gray-500">
                    No results found
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </form>
      </Form>
      {cardSearchResults.length > 0 && scrollAreaVisible && (
        <div className="absolute top-full z-50 mt-2">
          <ScrollArea
            className="h-72 w-72 rounded-md border bg-white"
            style={{ height: `${calculatedHeight}px` }}
          >
            <div className="p-4">
              {cardSearchResults.map((cardSearchResult) =>
                viewMode === 'en' ? (
                  <div
                    key={cardSearchResult.id}
                    className="cursor-pointer rounded p-2 text-sm transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    onClick={() => handleCardClick(cardSearchResult)}
                  >
                    {Object.keys(colorMapping).includes(cardSearchResult.color!.toLowerCase())
                      ? colorMapping[
                          cardSearchResult.color?.toLowerCase() as keyof typeof colorMapping
                        ]
                      : ''}{' '}
                    {cardSearchResult.name_eng} [{cardSearchResult.code}]
                  </div>
                ) : (
                  <div
                    key={cardSearchResult.id}
                    className="cursor-pointer rounded p-2 text-sm transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    onClick={() => handleCardClick(cardSearchResult)}
                  >
                    {Object.keys(colorMapping).includes(cardSearchResult.color!.toLowerCase())
                      ? colorMapping[
                          cardSearchResult.color?.toLowerCase() as keyof typeof colorMapping
                        ]
                      : ''}
                    {cardSearchResult.name_kr} [{cardSearchResult.code}]
                  </div>
                ),
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
