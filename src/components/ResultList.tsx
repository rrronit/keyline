import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ResultItem } from "./ResultItem";
import { ResultFooter } from "./ResultFooter";

interface ResultListProps {
	results: Array<{
		id: string;
		title: string;
		subtitle: string;
		icon: React.ReactNode;
		category: string;
		color: string;
	}>;
	selectedIndex: number;
	onSelect: (index: number) => void;
	loading: boolean;
}

export const ResultList = ({
	results,
	selectedIndex,
	onSelect,
	loading,
}: ResultListProps) => {
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (listRef.current && selectedIndex >= 0) {
			const selectedElement = listRef.current.children[
				selectedIndex
			] as HTMLElement;
			if (selectedElement) {
				const containerRect = listRef.current.getBoundingClientRect();
				const elementRect = selectedElement.getBoundingClientRect();

				if (elementRect.bottom > containerRect.bottom) {
					listRef.current.scrollTop +=
						elementRect.bottom - containerRect.bottom - 1;
				} else if (elementRect.top < containerRect.top) {
					listRef.current.scrollTop -=
						containerRect.top - elementRect.top;
				}
			}
		}
	}, [selectedIndex]);

	const listVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.02,
				delayChildren: 0.05,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 0.15,
			},
		},
	};

	return (
		<motion.div
			variants={listVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="relative"
		>
			{loading ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="flex flex-col items-center justify-center py-16 text-zinc-400"
				>
					<motion.div
						className="relative mb-4"
						animate={{ rotate: [0, 360] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<Search className="w-8 h-8 opacity-40" />
						<div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
					</motion.div>
					<p className="text-lg font-medium text-zinc-300">Loading...</p>
				</motion.div>
			) : results.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="flex flex-col items-center justify-center py-16 text-zinc-400"
				>
					<motion.div
						className="relative mb-4"
						animate={{ rotate: [0, 360] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<Search className="w-8 h-8 opacity-40" />
						<div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
					</motion.div>
					<p className="text-lg font-medium text-zinc-300">No results found</p>
					<p className="text-sm text-zinc-500 mt-1">Try a different search term</p>
				</motion.div>
			) : (
				<div
					ref={listRef}
					className="py-2 max-h-96 overflow-y-auto overflow-x-hidden scrollbar"
				>
					{results.map((item, index) => (
						<motion.div key={item.id}>
							<ResultItem
								item={item}
								isSelected={index === selectedIndex}
								onSelect={() => onSelect(index)}
							/>
						</motion.div>
					))}
				</div>
			)}

			{results.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2, delay: 0.1 }}
				>
					<ResultFooter resultCount={results.length} />
				</motion.div>
			)}
		</motion.div>
	);
};
