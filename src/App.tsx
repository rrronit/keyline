import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SearchBox } from "./components/SearchBox";
import { ResultList } from "./components/ResultList";
import { SearchFooter } from "./components/SearchFooter";
import { SettingsList } from "./components/SettingsList";
import { useSearch } from "./hooks/useSearch";
import { useKeyboardEvents } from "./hooks/useKeyboardEvents";
import { useWindowEvents } from "./hooks/useWindowEvents";
import {
	Calculator,
	Globe,
	FileText,
	Settings,
	Sparkles,
	Terminal,
	Music,
	ImageIcon,
} from "lucide-react";
import { ResultItem } from "./types";

const sampleResults: ResultItem[] = [
	{
		id: "1",
		title: "Calculate Expression",
		subtitle: "Perform mathematical calculations instantly",
		icon: <Calculator />,
		category: "Tools",
		color: "from-orange-500 to-red-500",
	},
	{
		id: "2",
		title: "Search Web",
		subtitle: "Search the internet for information",
		icon: <Globe />,
		category: "Web",
		color: "from-blue-500 to-cyan-500",
	},
	{
		id: "3",
		title: "Create Note",
		subtitle: "Create a new text note or document",
		icon: <FileText />,
		category: "Productivity",
		color: "from-green-500 to-emerald-500",
	},
	{
		id: "4",
		title: "Open Settings",
		subtitle: "Configure application preferences",
		icon: <Settings />,
		category: "System",
		color: "from-gray-500 to-zinc-500",
	},
	{
		id: "5",
		title: "AI Assistant",
		subtitle: "Get help with creative tasks",
		icon: <Sparkles />,
		category: "AI",
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "6",
		title: "Terminal",
		subtitle: "Execute command line operations",
		icon: <Terminal />,
		category: "Developer",
		color: "from-zinc-600 to-gray-700",
	},
	{
		id: "7",
		title: "Music Player",
		subtitle: "Control your music playback",
		icon: <Music />,
		category: "Media",
		color: "from-rose-500 to-pink-500",
	},
	{
		id: "8",
		title: "Image Generator",
		subtitle: "Create AI-powered images",
		icon: <ImageIcon />,
		category: "Creative",
		color: "from-indigo-500 to-purple-500",
	},
];

function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const { state, setState, loading, filteredResults } = useSearch({
		sampleResults,
	});
	const { isVisible } = useWindowEvents({ setState, inputRef });
	const [selectedIndex, setSelectedIndex] = useState(0);
	useKeyboardEvents({
		state,
		setState,
		selectedIndex,
		setSelectedIndex,
		filteredResults,
		mode: state.mode,
	});

	const closeSearch = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		await invoke("close_window");
	};

	// Animation variants
	const backdropVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.15,
				ease: "easeOut" as const,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 0.1,
				ease: "easeIn" as const,
			},
		},
	};

	const containerVariants: Variants = {
		hidden: {
			opacity: 0,
			y: 20,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeOut" as const,
			},
		},
		exit: {
			opacity: 0,
			y: 10,
			transition: {
				duration: 0.2,
				ease: "easeIn" as const,
			},
		},
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					variants={backdropVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="min-h-screen bg-gradient-to-br from-zinc-900/30 via-zinc-900/25 to-zinc-900/50 flex items-start justify-center px-4 relative overflow-hidden bg-[length:100%_100%]"
					onClick={closeSearch}
				>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="w-full max-w-2xl mt-[15vh]"
						onClick={(e) => e.stopPropagation()}
					>
						<motion.div
							onClick={(e) => e.stopPropagation()}
							className="backdrop-blur-2xl bg-zinc-900/90 border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 transition-all duration-300 hover:ring-white/20"
							style={{
								boxShadow:
									"0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
							}}
							whileHover={{
								scale: 1.002,
								transition: { duration: 0.2 },
							}}
						>
							<SearchBox
								query={state.query}
								onQueryChange={(query) =>
									setState((prev) => ({ ...prev, query }))
								}
								mode={state.mode}
								inputRef={inputRef}
							/>

							<AnimatePresence mode="wait">
								{state.mode === "result" && (
									<ResultList
										results={filteredResults}
										selectedIndex={selectedIndex}
										onSelect={(index: number) =>
											setSelectedIndex(index)
										}
										loading={loading}
									/>
								)}

								{state.mode === "settings" && <SettingsList />}

								{state.mode === "search" && <SearchFooter />}
							</AnimatePresence>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default App;
