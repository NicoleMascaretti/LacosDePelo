import { Search, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  /** Se não for passado, o componente controla o próprio estado */
  value?: string;
  /** Se não for passado, o componente controla o próprio estado */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
  placeholder = "Buscar produtos...",
  className = "",
  value,
  onChange,
}: SearchInputProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Controlado x não-controlado
  const isControlled = typeof value === "string" && typeof onChange === "function";
  const [internalValue, setInternalValue] = useState<string>(value ?? "");

  // Se virar controlado, mantenha o interno em sincronia
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isControlled]);

  const currentValue = isControlled ? (value as string) : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isControlled && onChange) onChange(e);
    else setInternalValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (currentValue.trim() === "") {
        if (location.pathname === "/produtos") {
          navigate("/produtos");
        }
      } else {
        navigate(`/produtos?search=${currentValue}`);
      }
    }
  };

  const handleClear = () => {
    if (isControlled && onChange) {
      onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
    } else {
      setInternalValue("");
    }

    if (location.pathname === "/produtos") {
      navigate("/produtos");
    }
  };

  return (
    <div className={`flex items-center bg-gray-100 rounded-full px-4 py-2 relative ${className}`}>
      <Search className="text-gray-500 h-5 w-5 mr-2" />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 pr-6"
      />

      {!!currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
