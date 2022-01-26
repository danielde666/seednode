import bowser from "bowser";
import { useState, useEffect } from "react";

export default function useDeviceInfo() {
	const [os, setOs] = useState(null);
	const [browser, setBrowser] = useState(null);
	const [platform, setPlatform] = useState(null);
	const [isMobile, setIsMobile] = useState(null);

	useEffect(() => {
		const parsed = bowser.getParser(window.navigator.userAgent);

		setOs(parsed.getOS());
		setBrowser(parsed.getBrowser());
		setPlatform(parsed.getPlatform());
	}, []);

	useEffect(() => {
		setIsMobile(platform ? platform !== "desktop" : window.innerWidth < 600);
	}, [platform]);

	return { isMobile, os, browser };
}
