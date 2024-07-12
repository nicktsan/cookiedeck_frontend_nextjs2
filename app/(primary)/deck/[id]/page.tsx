export default async function DeckView({ params }: { params: { id: string } }) {
// todo
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-6 font-bold text-center">
          Deck View page for {params.id}
        </div>
      </div>
    </div>
  );
}
