import { motion } from "framer-motion";

export const SearchFooter = () => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: 10 }}
		transition={{ duration: 0.2 }}
		className="px-6 py-2 border-t border-zinc-800/50 bg-gradient-to-r from-zinc-900/50 via-zinc-800/50 to-zinc-900/50"
	>
		<div className="flex items-center justify-between text-xs text-zinc-500">
			<div className="flex items-center space-x-2">
				{/* keyline logo */}
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="text-blue-400"
				>
					<path
						d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z"
						fill="currentColor"
					/>
					<path
						d="M8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8C4 5.79086 5.79086 4 8 4Z"
						fill="currentColor"
					/>
				</svg>
				<span>Start typing to search</span>
			</div>
			<div className="flex items-center space-x-4">
				<span className="flex items-center">
 					<kbd className="px-1.5 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-xs mr-1 backdrop-blur-sm">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M6 9l6 6 6-6"/>
						</svg>
					</kbd>
					more
				</span>
			</div>
		</div>
	</motion.div>
);
