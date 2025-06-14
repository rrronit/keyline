import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SearchState } from "../types";
import React from "react";

interface UseKeyboardEventsProps {
	state: SearchState;
	setState: (
		state: SearchState | ((prev: SearchState) => SearchState)
	) => void;
	selectedIndex: number;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	filteredResults: any[];
	mode: string;
}

export const useKeyboardEvents = ({
	state,
	setState,
	selectedIndex,
	setSelectedIndex,
	filteredResults,
}: UseKeyboardEventsProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				console.log("Selected:", filteredResults[selectedIndex]);
			}

			if (e.key === "ArrowDown" && state.mode === "result") {
				e.preventDefault();
				setSelectedIndex((prev: number) =>
					prev < filteredResults.length - 1 ? prev + 1 : 0
				);
			}

			if (e.key === "ArrowUp" && state.mode === "result") {
				e.preventDefault();
				setSelectedIndex((prev: number) =>
					prev > 0 ? prev - 1 : filteredResults.length - 1
				);
			}

			if (e.ctrlKey && e.key === "/") {
				if (state.mode !== "settings") {
					setState((prev) => ({ ...prev, mode: "settings" }));
				} else {
					setState((prev) => ({ ...prev, mode: "search" }));
				}
			}

			if (/^[a-zA-Z0-9\s]$/.test(e.key)) {
				console.log(e.key);
				setState((prev) => ({ ...prev, mode: "search" }));
			}

			if (e.key === "Escape") {
				if (state.mode === "settings") {
					setState((prev) => ({ ...prev, mode: "search" }));
				} else {
					invoke("close_window");
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		state.mode,
		state.query,
		filteredResults,
		selectedIndex,
		setState,
		setSelectedIndex,
	]);

};
