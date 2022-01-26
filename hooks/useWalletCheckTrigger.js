import { useContext, useEffect, useState } from "react";
import { Context as OnboardContext } from "../contexts/Onboard";

export default function useWalletCheckTrigger() {
	const [connectionAttempted, setConnectionAttempted] = useState(false);
	const { address, wallet, onboard } = useContext(OnboardContext);

	useEffect(() => {
		if (wallet !== null && wallet.provider && [undefined, ""].includes(address)) {
			onboard.walletCheck();
			setConnectionAttempted(true);
		}
	}, [wallet, address, onboard]);

	return { connectionAttempted };
}
