import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

interface VisibilitySelectProps {
  visibility: string;
  onVisibilityChange: (value: string) => void;
}

export function VisibilitySelect({ visibility, onVisibilityChange }: VisibilitySelectProps) {
  return (
    <div className="text-black">
      <Select onValueChange={(value) => onVisibilityChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={capitalizeFirstLetter(visibility ?? '')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Visibility</SelectLabel>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
