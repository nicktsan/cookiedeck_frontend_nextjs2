'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CardSearchRequestDTO } from '@/services/card/find/card-findDTO';
import { CardSearchRequestSchema } from '@/services/card/find/card-find.schema';
import { CardFind } from '@/services/card/find/card-find';
import { ScrollArea } from '../ui/scroll-area';
import { CardEntity } from '@/services/card/card.entity';
import { CreateDeckSlot } from '@/services/deckslot/create/createDeckSlot';

interface CardSearchProps {
  deckId: string | undefined;
  onUpdate: () => void;
  viewMode: 'en' | 'kr';
}

export default function CardSearch({ deckId, onUpdate, viewMode }: CardSearchProps) {
  const form = useForm<CardSearchRequestDTO>({
    resolver: zodResolver(CardSearchRequestSchema),
  });
  const [cardSearchResults, setCardSearchResults] = useState<CardEntity[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const scrollAreaClass = cardSearchResults.length > 0 ? 'h-72 w-72 rounded-md border' : 'hidden';

  const scrollAreaHeight = useMemo(() => {
    const itemHeight = 48; // Assuming each item (including separator) is roughly 3rem (48px) tall
    const maxHeight = 288; // 72 * 4 (assuming 1rem = 4px)
    return Math.min(cardSearchResults.length * itemHeight, maxHeight);
  }, [cardSearchResults.length]);

  async function onSubmit(data: CardSearchRequestDTO) {
    setSearchPerformed(true);
    try {
      const res: CardEntity[] = await CardFind(data);
      if (Array.isArray(res)) {
        // console.log('CardFind returned an array');
        // console.log(res);
        setCardSearchResults(res);
      } else {
        console.error('CardFind did not return an array');
        setCardSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
      setCardSearchResults([]);
    }
  }

  const handleCardClick = async (card: CardEntity) => {
    await CreateDeckSlot(card, deckId);
    onUpdate();
  };

  return (
    <div className="w-1/3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="Find and add cards to main deck." {...field} />
                  </FormControl>
                  <Button type="submit">Submit</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {searchPerformed && cardSearchResults.length === 0 ? (
        <div className="text-sm text-gray-500">No results found</div>
      ) : (
        <ScrollArea className={scrollAreaClass} style={{ height: `${scrollAreaHeight}px` }}>
          <div className="p-4">
            {cardSearchResults.map((cardSearchResult) =>
              viewMode === 'en' ? (
                <React.Fragment key={cardSearchResult.id}>
                  <div
                    className="cursor-pointer rounded p-2 text-sm transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    onClick={() => handleCardClick(cardSearchResult)}
                  >
                    {cardSearchResult.color}: {cardSearchResult.name_eng}
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment key={cardSearchResult.id}>
                  <div
                    className="cursor-pointer rounded p-2 text-sm transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    onClick={() => handleCardClick(cardSearchResult)}
                  >
                    {cardSearchResult.color}: {cardSearchResult.name_kr}
                  </div>
                </React.Fragment>
              ),
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
