import { useState, useEffect } from "react";

export default function useOnboardConfig({ onboard }) {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (onboard) {
			onboard.config({ darkMode });
		}
	}, [darkMode, onboard]);

	return { darkMode, setDarkMode };
}
