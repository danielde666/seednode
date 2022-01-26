import { useState, useEffect } from "react";
import { ethers } from "ethers";
import type { ContractInterface } from "ethers";

import useWeb3 from "./useWeb3";

export default function useContract({ address, contractABI }: { contractABI: ContractInterface; address: string }) {
	const { provider, signer } = useWeb3();
	const [contract, setContract] = useState(null);

	useEffect(() => {
		if (provider && signer && address && contractABI) {
			setContract(new ethers.Contract(address, contractABI, signer));
		}
	}, [provider, address, contractABI, signer]);

	return { contract };
}
