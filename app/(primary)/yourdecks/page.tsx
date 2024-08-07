import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  DeckFindRequestByCreatorIdSchema,
  DeckFindResponseByCreatorIdDataSchema,
  DeckFindResponseByCreatorIdSchema,
} from '@/services/deck/find/byCreatorId/findDeckByCreatorIdSchema';
import {
  DeckFindRequestByCreatorIdDTO,
  DeckFindResponseByCreatorIdDataDTO,
  DeckFindResponseByCreatorIdDTO,
} from '@/services/deck/find/byCreatorId/findDeckByCreatorIdDTO';
import { MakeApiRequest } from '@/services/baseApiRequest';
import { DeckEntity } from '@/services/deck/deck.entity';
import Link from 'next/link';
import { ValidateSchema } from '@/utils/schemaValidator';
import { ENV } from '@/env';
export default async function YourDecks() {
  //todo revalidate data after a deck is deleted
  function validate(dto: unknown): DeckFindResponseByCreatorIdDataDTO {
    return ValidateSchema({
      dto,
      schema: DeckFindResponseByCreatorIdDataSchema,
      schemaName: 'DeckFindResponseByCreatorIdDataSchema',
    });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }
  const url = ENV.BACKEND_URL + (ENV.PATH.GET_CREATOR_BY_ID_PATH ?? '/deck/find/bycreatorid');
  const params: DeckFindRequestByCreatorIdDTO = {
    creator_id: user.id,
    updatedAtOrderDirection: 'desc',
  };
  const res: DeckFindResponseByCreatorIdDTO = await MakeApiRequest({
    url,
    method: 'GET',
    requestSchema: DeckFindRequestByCreatorIdSchema,
    responseSchema: DeckFindResponseByCreatorIdSchema,
    data: params,
  });
  validate(res.data);
  let yourDecks: DeckEntity[] = [];
  if (res.data.decks) {
    yourDecks = res.data.decks;
  }
  return (
    <div className="flex flex-1 flex-col items-center gap-20">
      Your Decks
      {yourDecks?.map((yourDeck) => (
        <div key={yourDeck.id}>
          <Link
            className="text-center text-blue-500 hover:underline"
            key={yourDeck.id}
            href={`/deck/${yourDeck.id}`}
          >
            {yourDeck.name || 'Unnamed Deck'}
          </Link>
          <p>{yourDeck.updated_at}</p>
        </div>
      ))}
    </div>
  );
}
