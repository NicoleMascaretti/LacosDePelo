import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export default function SearchInput({
    value,
    onChange, 
    placeholder = "Buscar produtos...",
}: SearchInputProps) {
  return (
    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
      <Search className="text-gray-500 h-5 w-5 mr-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1"
      />
    </div>
  );
}
