import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => (
  <div className="relative mb-4 w-1/2">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 pl-9 bg-white border border-lcoffe text-db rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-dcoffe"
    />
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-db" />
  </div>
);

export default SearchInput;
