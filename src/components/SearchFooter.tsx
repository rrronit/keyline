import { motion } from "framer-motion";
import { Command } from "lucide-react";

export const SearchFooter = () => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: 10 }}
		transition={{ duration: 0.2 }}
		className="px-6 py-4 border-t border-zinc-700/50 bg-gradient-to-r from-zinc-800/30 to-zinc-900/30"
	>
		<div className="flex items-center justify-between text-xs text-zinc-500">
			<div className="flex items-center space-x-2">
				<Command className="w-3 h-3" />
				<span>Start typing to search</span>
			</div>
			<div className="flex items-center space-x-4">
				<span className="flex items-center">
					<kbd className="px-1.5 py-1 bg-zinc-700/50 border border-zinc-600/50 rounded text-xs mr-1 backdrop-blur-sm">
						⌘ /
					</kbd>
					settings
				</span>
				<span className="flex items-center">
					<kbd className="px-1.5 py-1 bg-zinc-700/50 border border-zinc-600/50 rounded text-xs mr-1 backdrop-blur-sm">
						esc
					</kbd>
					close
				</span>
			</div>
		</div>
	</motion.div>
);
