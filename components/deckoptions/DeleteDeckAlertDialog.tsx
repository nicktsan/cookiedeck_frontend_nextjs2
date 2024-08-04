'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IDeckIdProps } from '@/services/deck/deck.entity';
import { DeleteDeck } from '@/services/deck/delete/deck-delete';
import { useRouter } from 'next/navigation';

export function DeleteDeckAlertDialog({ deckId }: IDeckIdProps) {
  const router = useRouter();
  const handleDelete = async () => {
    console.log('Delete deck');
    const deleteResponse = await DeleteDeck(deckId);
    if (!deleteResponse.error) {
      router.push('/yourdecks');
    } else {
      console.log(deleteResponse.error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer rounded-sm p-2 text-red-500 hover:bg-red-500 hover:text-white">
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure you want to delete your deck?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your deck from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="hover:bg-red-500 hover:text-white" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
