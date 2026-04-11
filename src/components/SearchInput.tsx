import { useState, useRef, useEffect } from "react";
import { siteContent } from "@/data/content";

interface SearchInputProps {
  allModels: string[];
  onGuess: (modelName: string) => void;
  disabled?: boolean;
  guessedModels?: string[];
  onGiveUp?: () => void;
  canGiveUp?: boolean;
}

export function SearchInput({
  allModels,
  onGuess,
  disabled,
  guessedModels = [],
  onGiveUp,
  canGiveUp = false,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selectedIndex !== -1 && listRef.current) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  const filteredModels =
    query.trim() === ""
      ? []
      : allModels.filter((modelName) =>
          modelName.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (wrapperRef.current) {
        const y =
          wrapperRef.current.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 300);
  };

  const handleSelect = (modelName: string) => {
    if (guessedModels.includes(modelName)) return;

    onGuess(modelName);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredModels.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        let nextIndex = prevIndex + 1;
        while (
          nextIndex < filteredModels.length &&
          guessedModels.includes(filteredModels[nextIndex])
        ) {
          nextIndex++;
        }
        return nextIndex < filteredModels.length ? nextIndex : prevIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        let prev = prevIndex - 1;
        while (prev >= 0 && guessedModels.includes(filteredModels[prev])) {
          prev--;
        }
        return prev >= 0 ? prev : prevIndex;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (selectedIndex >= 0 && selectedIndex < filteredModels.length) {
        if (!guessedModels.includes(filteredModels[selectedIndex])) {
          handleSelect(filteredModels[selectedIndex]);
        }
        return;
      }

      const exactMatch = filteredModels.find(
        (name) =>
          name.toLowerCase() === query.trim().toLowerCase() &&
          !guessedModels.includes(name),
      );

      const availableModels = filteredModels.filter(
        (name) => !guessedModels.includes(name),
      );

      if (exactMatch) {
        handleSelect(exactMatch);
      } else if (availableModels.length === 1) {
        handleSelect(availableModels[0]);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="w-full relative px-2 sm:px-0 z-100">

      <div className="flex gap-2 w-full">

        <div className="relative flex-1">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={siteContent.search.placeholder}
            className="w-full bg-tp-card border-2 border-gray-800 focus:border-red-600 outline-none pl-4 pr-24 py-3 text-base font-bold placeholder-gray-600 transition-all uppercase tracking-tight disabled:opacity-50"
          />
          <button
            onClick={() => {
              if (
                selectedIndex >= 0 &&
                !guessedModels.includes(filteredModels[selectedIndex])
              ) {
                handleSelect(filteredModels[selectedIndex]);
                return;
              }

              const availableModels = filteredModels.filter(
                (name) => !guessedModels.includes(name),
              );
              const exactMatch = availableModels.find(
                (name) => name.toLowerCase() === query.trim().toLowerCase(),
              );

              if (exactMatch) handleSelect(exactMatch);
              else if (availableModels.length === 1)
                handleSelect(availableModels[0]);
            }}
            disabled={
              disabled ||
              filteredModels.length === 0 ||
              filteredModels.every((name) => guessedModels.includes(name))
            }
            className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 text-white px-4 text-xs font-black transition-all cursor-pointer active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed"
          >
            {siteContent.search.button}
          </button>
        </div>

        {canGiveUp && (
          <button
            onClick={onGiveUp}
            disabled={disabled}
            title="I give up"
            className="flex-none w-14 bg-tp-card border-2 border-gray-800 hover:border-gray-500 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && filteredModels.length > 0 && (
        <ul
          ref={listRef}
          className="absolute top-full mt-1 left-2 right-2 sm:left-0 sm:right-0 bg-tp-card border-2 border-gray-800 max-h-48 sm:max-h-55 overflow-y-auto overscroll-contain shadow-2xl z-100 custom-scrollbar"
        >
          {filteredModels.map((modelName, index) => {
            const isGuessed = guessedModels.includes(modelName);
            const isSelected = index === selectedIndex;

            return (
              <li
                key={modelName}
                onClick={() => {
                  if (!isGuessed) handleSelect(modelName);
                }}
                className={`px-4 py-3 text-sm font-bold uppercase border-b border-gray-800/50 last:border-0 transition-colors ${
                  isGuessed
                    ? "text-gray-600 cursor-not-allowed bg-transparent opacity-50"
                    : isSelected
                      ? "bg-red-600 text-white cursor-pointer"
                      : "hover:bg-gray-800 text-gray-300 cursor-pointer"
                }`}
              >
                {modelName}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}