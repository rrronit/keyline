import { motion } from 'framer-motion';

interface ResultFooterProps {
  resultCount: number;
}

export const ResultFooter = ({ resultCount }: ResultFooterProps) => (
  <div className="border-t border-zinc-800/50 bg-gradient-to-r to-zinc-900/50 px-6 py-4">
    <div className="flex items-center justify-between text-xs text-zinc-500">
      <span className="flex items-center">
        <motion.div
          className="mr-2 h-2 w-2 rounded-full bg-blue-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {resultCount} result{resultCount !== 1 ? 's' : ''} found
      </span>
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <kbd className="mr-1 rounded border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-1 text-xs backdrop-blur-sm">
            ↑↓
          </kbd>
          navigate
        </span>
        <span className="flex items-center">
          <kbd className="mr-1 rounded border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-1 text-xs backdrop-blur-sm">
            ↵
          </kbd>
          select
        </span>
        <span className="flex items-center">
          <kbd className="mr-1 rounded border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-1 text-xs backdrop-blur-sm">
            esc
          </kbd>
          close
        </span>
      </div>
    </div>
  </div>
);
