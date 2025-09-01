import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SearchInputProps {
  placeholder?: string;
  className?: string; // 🔹 permite passar estilos (ex: hidden md:flex ou flex md:hidden)
}

export default function SearchInput({
  placeholder = "Buscar produtos...",
  className = "",
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    setValue("");
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
        onChange={(e) => setValue(e.target.value)}
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
