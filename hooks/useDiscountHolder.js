import { useState } from "react";
import axios from "axios";


//prod contract 
const contractAddress = "0xbcdf4823fc65e6aa243963f955fd5ce885066306";

//test contract
//const contractAddress = "0xfee1Cd96E657D7bB203EE72e54eA4AAb28bA6fC7";
 
const verificationUrl = "https://ae-backend.lobus.io/validate-nft-ownership";
const message = "Requesting ownership verification...";

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
