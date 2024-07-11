import { CreateDeckForm } from "../../../components/CreateDeckForm";
export default async function CreateDeck() {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      Create Deck
      <CreateDeckForm />     
    </div>
  );
}
  