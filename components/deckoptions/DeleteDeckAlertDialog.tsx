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
import { DeckDeleteResponseDataDTO } from '@/services/deck/delete/deck-delete.dto';
import { ErrorResponseDataDTO } from '@/utils/error.schema';
import { useRouter } from 'next/navigation';

export function DeleteDeckAlertDialog({ deckId }: IDeckIdProps) {
  const router = useRouter();

  // Type guard to check if the response is DeckDeleteResponseDataDTO
  function isDeckDeleteResponseDataDTO(response: any): response is DeckDeleteResponseDataDTO {
    return (response as DeckDeleteResponseDataDTO).isDeleted !== undefined;
  }

  // Type guard to check if the response is ErrorResponseDataDTO
  function isErrorResponseDataDTO(response: any): response is ErrorResponseDataDTO {
    if ((response as ErrorResponseDataDTO).error !== undefined) {
      return true;
    }
    return (response as ErrorResponseDataDTO).errorCode !== undefined;
  }

  const handleDelete = async () => {
    const deleteResponse: DeckDeleteResponseDataDTO | ErrorResponseDataDTO =
      await DeleteDeck(deckId);
    if (isDeckDeleteResponseDataDTO(deleteResponse)) {
      if (deleteResponse.isDeleted) {
        router.push('/yourdecks');
      } else {
        console.error('Unexpected response structure:', deleteResponse);
      }
    } else if (isErrorResponseDataDTO(deleteResponse)) {
      console.log(deleteResponse.message || deleteResponse.errorMessage);
      if (deleteResponse.DTO) {
        console.log(deleteResponse.DTO);
      }
    } else {
      console.error('Unknown response type:', deleteResponse);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" asChild>
        <div className="w-full cursor-pointer rounded-sm px-2 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
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
