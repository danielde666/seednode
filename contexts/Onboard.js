import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";

import useDeviceInfo from "../hooks/useDeviceInfo";

const networkId = 3;
const rpcUrl = "https://eth-ropsten.alchemyapi.io/v2/cqc9cLYyw8V78EHTQsM6IM2yLy_8iJmJ";
const dappId = "73bcf726-b226-4f5b-95a0-0081eb9d252d";
const appUrl = "";
const email = "";
const appName = "LSS Seed Discount";

function initOnboard(subscriptions, { isMobile = false } = {}) {
	return Onboard({
		dappId,
		hideBranding: true,
		networkId,
		subscriptions,
		walletCheck: [
			{ checkName: "derivationPath" },
			{ checkName: "connect" },
			{ checkName: "accounts" },
			{ checkName: "network" },
			// { checkName: "balance", minimumBalance: "100000" },
		],
		walletSelect: {
			wallets: [
				{ walletName: "metamask", preferred: !isMobile },
				{ walletName: "coinbase", preferred: !isMobile },
				{ walletName: "trezor", appUrl, email, rpcUrl, preferred: !isMobile },
				{ walletName: "ledger", rpcUrl, preferred: !isMobile },
				// {
				// 	walletName: "walletConnect",
				// 	rpc: { [networkId]: rpcUrl },
				// 	preferred: true,
				// },
				{ walletName: "trust", rpcUrl },
				{ walletName: "cobovault", appName, rpcUrl },
				{ walletName: "keystone", appName, rpcUrl },
				{ walletName: "keepkey", rpcUrl },
				{ walletName: "lattice", appName, rpcUrl },
				{ walletName: "status" },
				{ walletName: "walletLink", rpcUrl },
				{ walletName: "torus" },
				{ walletName: "opera" },
				{ walletName: "operaTouch" },
				{ walletName: "imToken", rpcUrl },
				{ walletName: "meetone" },
				{ walletName: "mykey", rpcUrl },
				{ walletName: "wallet.io", rpcUrl },
				{ walletName: "huobiwallet", rpcUrl },
				{ walletName: "alphawallet", rpcUrl },
				{ walletName: "hyperpay" },
				{ walletName: "atoken" },
				{ walletName: "liquality" },
				{ walletName: "frame" },
				{ walletName: "tokenpocket", rpcUrl },
				{ walletName: "authereum", disableNotifications: true },
				{ walletName: "ownbit" },
				{ walletName: "gnosis" },
				{ walletName: "dcent" },
				{ walletName: "bitpie" },
				{ walletName: "xdefi" },
				{ walletName: "binance" },
				{ walletName: "tp" },
				{ walletName: "tally" },
				{ walletName: "blankwallet" },
				{ walletName: "mathwallet" },
				// { walletName: "ronin" },

				// { walletName: "portis", apiKey: apiKeys.portis },
				// { walletName: "fortmatic", apiKey: apiKeys.fortmatic },
			],
		},
	});
}

export const Context = createContext({
	address: undefined,
	balance: null,
	ens: null,
	network: undefined,
	onboard: null,
	provider: null,
	signer: null,
	wallet: null,
});

function useSigner({ provider }) {
	const [signer, setSigner] = useState(null);

	useEffect(() => {
		async function getSinger() {
			try {
				const newSigner = await provider.getSigner();

				setSigner(newSigner);
			} catch (error) {
				console.log("Error getting signer: ", error);
			}
		}

		if (provider === null) {
			setSigner(null);
		} else {
			getSinger();
		}
	}, [provider]);

	return { signer };
}

function useRememberedWallet({ onboard }) {
	useEffect(() => {
		const previouslySelectedWallet = window.localStorage.getItem("selectedWallet");

		if (previouslySelectedWallet && onboard) {
			onboard.walletSelect(previouslySelectedWallet);
		}
	}, [onboard]);
}

function useOnboard() {
	const [provider, setProvider] = useState(null);
	const [address, setAddress] = useState();
	const [ens, setEns] = useState(null);
	const [network, setNetwork] = useState();
	const [balance, setBalance] = useState(null);
	const [wallet, setWallet] = useState(null);
	const [onboard, setOnboard] = useState(null);
	const [darkMode, setDarkMode] = useState(false);
	const { isMobile } = useDeviceInfo();

	useEffect(() => {
		if (isMobile !== null && onboard === null) {
			const instance = initOnboard(
				{
					address: setAddress,
					balance: setBalance,
					ens: setEns,
					network: setNetwork,
					wallet: (newWallet) => {
						if (newWallet.provider) {
							setWallet(newWallet);

							setProvider(new ethers.providers.Web3Provider(newWallet.provider, "any"));

							window.localStorage.setItem("selectedWallet", newWallet.name);
						} else {
							setProvider(null);
							setWallet(null);
						}
					},
				},
				{ isMobile },
			);

			setOnboard(instance);
		}
	}, [isMobile, onboard]);

	return { provider, wallet, address, onboard, ens, network, darkMode, setDarkMode, balance };
}

export function Provider({ children }) {
	const { provider, wallet, address, onboard, ens, network, balance } = useOnboard();
	const { signer } = useSigner({ provider });

	useRememberedWallet({ onboard });

	const value = { address, balance, ens, network, onboard, provider, signer, wallet };

	return <Context.Provider value={value}>{children}</Context.Provider>;
}
