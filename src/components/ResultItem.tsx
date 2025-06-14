import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ResultItemProps {
  item: {
    id: string;
    title: string;
    subtitle: string;
    icon: ReactNode;
    category: string;
    color: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export const ResultItem = ({ item, isSelected, onSelect }: ResultItemProps) => {
  return (
    <motion.div
      onClick={onSelect}
      className={`group flex items-center px-6 py-3 cursor-pointer relative ${
        isSelected
          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-400"
          : "hover:bg-zinc-800/30"
      }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.998 }}
      transition={{ duration: 0.15 }}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
          />
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.div
          className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200 ${
            isSelected
              ? `bg-gradient-to-br ${item.color} shadow-lg`
              : "bg-zinc-700/50 group-hover:bg-zinc-600/50"
          }`}
          animate={{
            scale: isSelected ? 1.05 : 1,
            rotateY: isSelected ? [0, 5, 0] : 0,
          }}
        >
          <motion.div
            className={`duration-200 ${
              isSelected ? "text-white" : "text-zinc-300"
            }`}
            animate={{ rotateZ: isSelected ? [0, 5, -5, 0] : 0 }}
          >
            {item.icon}
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-xl blur-md -z-10`}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center justify-between">
          <h3
            className={`font-semibold truncate duration-200 ${
              isSelected
                ? "text-white"
                : "text-zinc-200 group-hover:text-white"
            }`}
          >
            {item.title}
          </h3>
        </div>
        <p
          className={`text-sm truncate mt-0.5 duration-200 ${
            isSelected
              ? "text-zinc-300"
              : "text-zinc-400 group-hover:text-zinc-300"
          }`}
        >
          {item.subtitle}
        </p>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center ml-4"
          >
            <motion.kbd
              className="px-2 py-1 text-xs font-semibold text-zinc-300 bg-zinc-700/50 border border-zinc-600/50 rounded backdrop-blur-sm"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.3)",
                  "0 0 0 4px rgba(59, 130, 246, 0.1)",
                  "0 0 0 0 rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ↵
            </motion.kbd>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 