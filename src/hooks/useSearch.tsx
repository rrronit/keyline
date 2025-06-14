import { useState, useEffect } from "react";
import { SearchState, ResultItem } from "../types";

// Sample data moved from App.tsx

export const useSearch = ({sampleResults}: {sampleResults: ResultItem[]}) => {
	const [state, setState] = useState<SearchState>({
		query: "",
		mode: "search",
	});
	const [loading, setLoading] = useState(false);
	const [filteredResults, setFilteredResults] =
		useState<ResultItem[]>(sampleResults);

	useEffect(() => {
		if (state.query.trim()) {
			setLoading(true);
			setState((prev) => ({ ...prev, mode: "result" }));

			// Simulate network delay
			const timeout = setTimeout(() => {
				const filtered = sampleResults.filter(
					(item) =>
						item.title
							.toLowerCase()
							.includes(state.query.toLowerCase()) ||
						item.subtitle
							.toLowerCase()
							.includes(state.query.toLowerCase()) ||
						item.category
							.toLowerCase()
							.includes(state.query.toLowerCase())
				);
				setFilteredResults(filtered);
				setLoading(false);
			}, 30);

			return () => clearTimeout(timeout);
		} else {
			setFilteredResults(sampleResults);
			setState((prev) => ({ ...prev, mode: "search" }));
			setLoading(false);
		}
	}, [state.query]);

	return {
		state,
		setState,
		loading,
		filteredResults,
	};
};
