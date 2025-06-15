import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  mode: 'search' | 'result' | 'settings';
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SearchBox = ({ query, onQueryChange, mode, inputRef }: SearchBoxProps) => {
  return (
    <div className="relative">
      <div className="flex items-center border-b border-zinc-800/50 bg-gradient-to-r from-zinc-900/50 via-zinc-800/50 to-zinc-900/50 px-3 py-4">
        <motion.div
          className="relative mr-4"
          animate={{
            scale: query ? 1.1 : 1,
            color: query ? '#3b82f6' : '#a1a1aa',
          }}
          transition={{ duration: 0.2 }}
        >
          <Search className="h-5 w-5 text-zinc-400 transition-colors duration-200" />
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"
            animate={{ opacity: query ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Search for anything..."
          className="flex-1 bg-transparent text-lg text-white placeholder-zinc-400 transition-all duration-200 focus:placeholder-zinc-500 focus:outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="ml-4 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-2 py-1 text-xs text-zinc-400"
            >
              {mode === 'result' ? '↵ to select' : 'searching...'}
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
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-0 h-px origin-center bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
