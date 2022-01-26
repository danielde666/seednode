import { useContext, useState, useEffect } from "react";
import { Context as OnboardContext } from "../contexts/Onboard";

export default function useWeb3() {
	const [account, setAccount] = useState("");
	const { provider, signer, address, balance, network, ens, wallet, onboard } = useContext(OnboardContext);

	useEffect(() => {
		setAccount(address || "");
	}, [address]);

	async function connect() {
		await onboard.walletSelect();
		await onboard.walletCheck();
	}

	function disconnect() {
		onboard.walletReset();
	}

	return {
		provider,
		signer,
		account,
		balance,
		ens,
		network,
		onboard,
		wallet,
		connect,
		disconnect,
	};
}
