import { redirect } from "next/navigation";
import { CreateDeckForm } from "../../../components/CreateDeckForm";
import { createClient } from "@/utils/supabase/server";
export default async function CreateDeck() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="flex-1 flex flex-col gap-20 items-center">
      Create Deck
      <CreateDeckForm />     
    </div>
  );
}
  