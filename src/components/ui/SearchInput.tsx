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
    <div
      className={`
        flex items-center bg-gray-100 rounded-full relative
        min-w-0
        h-10 md:h-11
        px-3 md:px-4
        ${className}
      `}
    >
      <Search className="text-gray-500 h-4 w-4 md:h-5 md:w-5 mr-2" />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          bg-transparent outline-none flex-1 pr-6 min-w-0
          text-sm md:text-base
        "
      />

      {!!currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
          aria-label="Limpar busca"
        >
          <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>
      )}
    </div>
  );
}
