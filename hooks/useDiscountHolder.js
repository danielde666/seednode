import { useState, useEffect } from "react";
import axios from "axios";

const contractAddress = "0x36c5d285ca9bb42f367468ed0f44448dc5dcfeda";
const verificationUrl = "https://ae-backend.staging.lobus.io/validate-nft-ownership";
const message = "Doesn't matter right now";

export default function useDiscountHolder({ signer }) {
	const [discountHolder, setDiscountHolder] = useState(null);
	const [ownedCount, setOwnedCount] = useState(null);

	const checkForDiscount = async () => {
		if (discountHolder === null && ownedCount === null) {
			try {
				const signature = await signer.signMessage(message);
				const response = await axios.post(verificationUrl, {
					message,
					signature,
					contractAddress,
				});

				const {
					data: { count, owner },
				} = response;

				setDiscountHolder(owner);
				setOwnedCount(count);

				return { ownedCount: count, discountHolder: owner };
			} catch (error) {
				console.log("Error looking for discount: ", error);
			}
		} else {
			return { ownedCount, discountHolder };
		}
	};

	return { checkForDiscount, ownedCount, discountHolder };
}
