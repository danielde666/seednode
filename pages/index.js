import { useState , useEffect} from "react";
import Image from "next/image";
import { Button, Header, Grid } from "semantic-ui-react";
import Router from "next/router";

import { client } from "../utils/shopify";
import useWeb3 from "../hooks/useWeb3";
import useDiscountHolder from "../hooks/useDiscountHolder";
import useWalletCheckTrigger from "../hooks/useWalletCheckTrigger";

const { Row, Column } = Grid;

function DiscountExample({ signer }) {
	
	const [itemPrice, setItemPrice] = useState("2500.00");
	const quantity = 1;
	const { checkForDiscount, ownedCount, discountHolder } = useDiscountHolder({ signer });


	const addRegularRemoveDiscount = async () => {


		const storage = window.localStorage;
		let checkoutId = storage.getItem("checkoutId");
		let currentcart = storage.getItem("cart");

		if (currentcart){
			const currentlineitemprice = cart.lineItems[0].variant.price;
			setItemPrice(currentlineitemprice);

			const lineItemsToAdd = [
				{
					variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTA5NzU2Mjg4MjIxNg==",
					//regular variant id 
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
		
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			console.log(cart);

			const exisitingcheckout = await client.checkout.fetch(checkoutId);

			if (exisitingcheckout.lineItems){
				
				const exisitingcheckoutitem = exisitingcheckout.lineItems[0].id;
				const lineItemsToRemove = [
					exisitingcheckoutitem //discount product id 
				];
				const cartremoved = await client.checkout.removeLineItems(checkoutId, lineItemsToRemove);
				storage.setItem("cart", JSON.stringify(cartremoved));
			}
		}

		if (!checkoutId) {

			const checkout = await client.checkout.create();
			checkoutId = checkout.id;
			storage.setItem("checkoutId", checkoutId);
			const lineItemsToAdd = [
				{
					variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTA5NzU2Mjg4MjIxNg==",
					//regular variant id 
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
			
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			storage.setItem("cart", JSON.stringify(cart));
			setItemPrice(cart.subtotalPrice);
		}

		
		
	};

	const removeRegularAddDiscount = async () => {
		const storage = window.localStorage;
		let checkoutId = storage.getItem("checkoutId");
		let currentcart = storage.getItem("cart");

		if (currentcart){
			const currentlineitemprice = cart.totalPrice;
			setItemPrice(currentlineitemprice);
			
			const lineItemsToAdd = [
				{
					variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTkxNTEwODUyNDIwMA==",
					//discount variant id 
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
		
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			console.log(cart);

			const exisitingcheckout = await client.checkout.fetch(checkoutId);

			if (exisitingcheckout.lineItems){
				
				const exisitingcheckoutitem = exisitingcheckout.lineItems[0].id;
				const lineItemsToRemove = [
					exisitingcheckoutitem //discount product id 
				];
				const cartremoved = await client.checkout.removeLineItems(checkoutId, lineItemsToRemove);
				storage.setItem("cart", JSON.stringify(cartremoved));
			}
		}

		if (!checkoutId) {
			const checkout = await client.checkout.create();
			checkoutId = checkout.id;
			storage.setItem("checkoutId", checkoutId);

			const lineItemsToAdd = [
				{
					variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTkxNTEwODUyNDIwMA==",
					//discount variant id 
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
		
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			storage.setItem("cart", JSON.stringify(cart));
			setItemPrice(cart.subtotalPrice);

		} else {


			const lineItemsToAdd = [
				{
					variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTkxNTEwODUyNDIwMA==",
					//discount variant id 
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
		
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			console.log(cart);
			setItemPrice(cartremoved.subtotalPrice);

			const exisitingcheckout = await client.checkout.fetch(checkoutId);
			if (exisitingcheckout.lineItems){
				
				const exisitingcheckoutitem = exisitingcheckout.lineItems[0].id;
				const lineItemsToRemove = [
					exisitingcheckoutitem //discount product id 
				];
				const cartremoved = await client.checkout.removeLineItems(checkoutId, lineItemsToRemove);
				storage.setItem("cart", JSON.stringify(cartremoved));
				console.log(cartremoved);
			}

		}
		
		
	};

	useEffect(() => {
	if(discountHolder !== null) {
		if(discountHolder) {
		//setLineItem(discounted)
		console.log("discounted");
		removeRegularAddDiscount();
		} else {
		//setLineItem(regular)
		console.log("regular")
		addRegularRemoveDiscount();
		}
	}
	}, [discountHolder])



	return (
		<>
			<p>PRICE: ${itemPrice}</p>
			<button onClick={checkForDiscount}>Check for discount</button>
			<ul>
				<li>
					<b>Discount:</b> {discountHolder === null ? "unknown" : `${discountHolder}`}
				</li>
				<li>
					<b>Amount Owned:</b> {ownedCount === null ? "unknown" : ownedCount}
				</li>
			</ul>
		</>
	);
}

const Index = ({ product }) => {
	const { signer, account } = useWeb3();
	const [price, setPrice] = useState(0);

	useWalletCheckTrigger();

	const [image] = product.images;
	const quantity = 1;
	const connected = Boolean(account);







	return (
		<Grid container centered>
			<Row>
				<Column width={10}>
					<Row>
						<br></br>
						<Image src={image.src} width={500} height={500} />
					</Row>
				</Column>

				<Column style={{ marginTop: 50 }} width={6}>
					<Header as="h3">{product.title}</Header>

					<>
						<p>
							Lucien Smith<br></br>Acrylic paint on canvas<br></br> 8.5 x 10 in<br></br> 64 x 96 cm
						</p>
					</>
					<p>{product.description}</p>

				

				
					<div style={{ padding: "2rem", border: "1px solid black" }}>
						{connected ? <DiscountExample signer={signer} /> : <div>Connect to wallet</div>}
					</div>

					<Button
						onClick={() => {
							const storage = window.localStorage;
							const cart = JSON.parse(storage.getItem("cart"));
							if (cart !== "") {
								Router.replace(cart.webUrl);
							}
						}}
					>
					PURCHASE
					</Button>
				</Column>
			</Row>
		</Grid>
	);
};

export async function getServerSideProps(context) {
	const { req } = context;
	const product = await client.product.fetchByHandle("carrot-seed-packet");
	const discountedproduct = await client.product.fetchByHandle("copy-of-seed-date-painting");
	const walletready = req.cookies.walletready;

	return {
		props: {
			product: JSON.parse(JSON.stringify(product)),
			discountedproduct: JSON.parse(JSON.stringify(discountedproduct)),
			walletready: walletready || "null",
		}, // will be passed to the page component as props
	};
}

export default Index;
