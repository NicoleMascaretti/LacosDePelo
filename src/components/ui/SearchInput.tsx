import { Search, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
  placeholder = "Buscar produtos...",
  className = "",
  value,    
  onChange,
}: SearchInputProps) { 

  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.trim() === "") {
        if (location.pathname === "/produtos") {
          navigate("/produtos");
        }
      } else {
        navigate(`/produtos?search=${value}`);
      }
    }
  };

  const handleClear = () => {
    onChange({
      target: { value: "" },
    } as ChangeEvent<HTMLInputElement>);

    if (location.pathname === "/produtos") {
      navigate("/produtos");
    }
  };

  return (
    <div
      className={`flex items-center bg-gray-100 rounded-full px-4 py-2 relative ${className}`}
    >
      <Search className="text-gray-500 h-5 w-5 mr-2" />
      <input
        type="text"
        value={value}         
        onChange={onChange}   
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 pr-6"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}