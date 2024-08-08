'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CardSearchRequestDTO } from '@/services/card/find/card-findDTO';
import { CardSearchRequestSchema } from '@/services/card/find/card-find.schema';
import { CardFind } from '@/services/card/find/card-find';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardEntity } from '@/services/card/card.entity';
import { CreateDeckSlot } from '@/services/deckslot/create/createDeckSlot';

import { useQuery } from '@tanstack/react-query';

interface CardSearchProps {
  deckId: string | undefined;
  onUpdate: () => void;
  viewMode: 'en' | 'kr';
}

export default function CardSearch({ deckId, onUpdate, viewMode }: CardSearchProps) {
  const form = useForm<CardSearchRequestDTO>({
    resolver: zodResolver(CardSearchRequestSchema),
  });
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

  const handleInputChange = () => {
    setScrollAreaVisible(false);
  };

  const handleCardClick = async (card: CardEntity) => {
    await CreateDeckSlot(card, deckId);
    onUpdate();
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
                    {cardSearchResult.color}: {cardSearchResult.name_eng}
                  </div>
                ) : (
                  <div
                    key={cardSearchResult.id}
                    className="cursor-pointer rounded p-2 text-sm transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    onClick={() => handleCardClick(cardSearchResult)}
                  >
                    {cardSearchResult.color}: {cardSearchResult.name_kr}
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
