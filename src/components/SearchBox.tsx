import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  mode: "search" | "result" | "settings";
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SearchBox = ({
  query,
  onQueryChange,
  mode,
  inputRef,
}: SearchBoxProps) => {
  return (
    <div className="relative">
      <div className="flex items-center px-6 py-5 border-b border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50">
        <motion.div
          className="relative mr-4"
          animate={{
            scale: query ? 1.1 : 1,
            color: query ? "#3b82f6" : "#a1a1aa",
          }}
          transition={{ duration: 0.2 }}
        >
          <Search className="w-5 h-5 text-zinc-400 transition-colors duration-200" />
          <motion.div
            className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"
            animate={{ opacity: query ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for anything..."
          className="flex-1 bg-transparent text-white placeholder-zinc-400 text-lg focus:outline-none transition-all duration-200 focus:placeholder-zinc-500"
        />
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="ml-4 px-2 py-1 bg-zinc-700/50 rounded-md text-xs text-zinc-400"
            >
              {mode === "result" ? "↵ to select" : "searching..."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent origin-center"
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 