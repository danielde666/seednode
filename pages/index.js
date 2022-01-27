import { useState } from "react";
import Image from "next/image";
import { Button, Header, Grid } from "semantic-ui-react";
import Router from "next/router";

import { client } from "../utils/shopify";
import useWeb3 from "../hooks/useWeb3";
import useDiscountHolder from "../hooks/useDiscountHolder";
import useWalletCheckTrigger from "../hooks/useWalletCheckTrigger";

const { Row, Column } = Grid;

function DiscountExample({ signer }) {
	const { checkForDiscount, ownedCount, discountHolder } = useDiscountHolder({ signer });
	return (
		<>
			<h2>Discount Example</h2>
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

const Index = ({ product, discountedproduct }) => {
	const { signer, account } = useWeb3();
	const [price, setPrice] = useState(0);

	useWalletCheckTrigger();

	const [image] = product.images;
	const quantity = 1;
	const connected = Boolean(account);

	const applyDiscount = async () => {
		const storage = window.localStorage;
		let checkoutId = storage.getItem("checkoutId");

		if (!checkoutId) {
			const checkout = await client.checkout.create();
			checkoutId = checkout.id;
			storage.setItem("checkoutId", checkoutId);
		}

		const cart = await client.checkout.addDiscount(checkoutId, "SEEDHOLDER");
		storage.setItem("cart", JSON.stringify(cart));
		setPrice(cart.subtotalPrice);
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


		const addRegularRemoveDiscount = async () => {
			const lineItemsToAdd = [
				{
					variantId: product.variants[0].id,
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
			const lineItemsToRemove = [
				{
					variantId: discountedproduct.variants[0].id,
					quanitty,
				}
			];
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			const cartremoved = await client.checkout.removeLineItems(checkoutId, lineItemsToRemove);
			storage.setItem("cart", JSON.stringify(cartremoved));
			console.log(cart);
			setPrice(cart.subtotalPrice);
		};

		const removeRegularAddDiscount = async () => {
			const storage = window.localStorage;
			let checkoutId = storage.getItem("checkoutId");
	
			if (!checkoutId) {
				const checkout = await client.checkout.create();
				checkoutId = checkout.id;
				storage.setItem("checkoutId", checkoutId);
			}
			const lineItemsToAdd = [
				{
					variantId: discountedproduct.variants[0].id,
					quantity,
					//customAttributes: [{key: "MyKey", value: "MyValue"}]
				},
			];
			const lineItemsToRemove = [
				{
					variantId: product.variants[0].id,
					quanitty,
				}
			];
			const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
			const cartremoved = await client.checkout.removeLineItems(checkoutId, lineItemsToRemove);
			storage.setItem("cart", JSON.stringify(cartremoved));
			console.log(cartremoved);
			setPrice(cart.subtotalPrice);
		};




	const addToCart = async () => {
		const storage = window.localStorage;
		let checkoutId = storage.getItem("checkoutId");

		if (!checkoutId) {
			const checkout = await client.checkout.create();
			checkoutId = checkout.id;
			storage.setItem("checkoutId", checkoutId);
		}
		const lineItemsToAdd = [
			{
				variantId: product.variants[0].id,
				quantity,
				//customAttributes: [{key: "MyKey", value: "MyValue"}]
			},
		];
		const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);

		storage.setItem("cart", JSON.stringify(cart));
		setPrice(cart.subtotalPrice);
	};

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

					<br></br>

					<span>
						Price : {product.variants[0].price}
						<br></br>
						Subtotal: {price}
						<br></br>
					</span>

					<div style={{ padding: "2rem", border: "1px solid black" }}>
						{connected ? <DiscountExample signer={signer} /> : <div>Connect to wallet</div>}
					</div>

					<Button onClick={() => addToCart()}>Add To Cart</Button>
					<Button
						onClick={() => {
							const storage = window.localStorage;
							const cart = JSON.parse(storage.getItem("cart"));
							if (cart !== "") {
								Router.replace(cart.webUrl);
							}
						}}
					>
						CHECKOUT
					</Button>
				</Column>
			</Row>
		</Grid>
	);
};

export async function getServerSideProps(context) {
	const { req } = context;
	const product = await client.product.fetch("Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwNzgzNzkxNTk3MjA=");
	const discountedproduct = await client.product.fetch("Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzczMjkwMDk1MDAzMjg=");
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
