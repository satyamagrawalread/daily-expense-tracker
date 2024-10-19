import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const SelectComponent = ({
  options,
  onValueChange,
  value,
  placeholder = "",
  className = "",
}: {
  options: {
    label: string;
    value: string;
  }[];
  onValueChange: (value: string) => void;
  value: string | undefined;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(" w-full ", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
