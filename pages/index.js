import { useState , useEffect} from "react";
import Image from "next/image";
import { Button, Header, Grid} from "semantic-ui-react";
import Router from "next/router";

import { client } from "../utils/shopify";

import { Provider as OnboardProvider } from "../contexts/Onboard";
import useWeb3 from "../hooks/useWeb3";
import useDiscountHolder from "../hooks/useDiscountHolder";
import useWalletCheckTrigger from "../hooks/useWalletCheckTrigger";
import { Swiper, SwiperSlide } from 'swiper/react';

const { Row, Column } = Grid;

function DiscountExample({ signer }) {
	
	const [itemPrice, setItemPrice] = useState("$2500.00");
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
		setItemPrice("$1250.00");

		} else {
		//setLineItem(regular)
		console.log("regular")
		addRegularRemoveDiscount();
		}
	}
	}, [discountHolder])



	return (
		<>
			<p className="prices">PRICE: {discountHolder ? <><strike>$2500.00</strike> <span>$1250.00</span></>  : "$2500.00"}</p>
			<p>SEED NFT owners - Receive a 50% discount.</p>
			<button onClick={checkForDiscount}>{discountHolder ?"Discount Applied!"  : "Verify for Discount" }</button>
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
	const { signer, account, connect } = useWeb3();

	useWalletCheckTrigger();

	const [image] = product.images;
	const quantity = 1;
	const connected = Boolean(account);

	

	



	return (
		<Grid  fluid centered verticalAlign='top' stackable className="fade-in maincontent" style={{opacity:0, padding: "0px 30px 90px" }}>
			<Row className="rowholder">
				<Column width={16} className="imageholder" centered verticalAlign="top">
					<Row>		
						
					<Swiper
						spaceBetween={50}
						slidesPerView={3}
						onSlideChange={() => console.log('slide change')}
						onSwiper={(swiper) => console.log(swiper)}
						>
					
					{product.images.map((image,index) => {
							return <SwiperSlide  key={index} ><Image width={666} height={420} src={image.src}/></SwiperSlide>;
						})}
					</Swiper>
					</Row>





				</Column>

				<Column width={16} className="infoholder" centered verticalAlign="top"> 
					

					<>
						<p>{product.title}(s)<br></br>
							Lucien Smith<br></br>Acrylic paint and silkscreen ink on canvas<br></br> 8 x 10 in<br></br> 20.32 x 25.4 cm
						</p>
					</>
				

				
					<div className="discountholder">



						{connected ? <DiscountExample signer={signer} /> : 
						
			<div>PRICE: $2500.00<br></br><br></br>SEED NFT owners - Receive a 50% discount.<br></br><br></br>
			
			<button onClick={() => {connect()}}>Connect Wallet</button></div>}
					</div>
					{connected ? 
					<><Button
						onClick={() => {
							const storage = window.localStorage;
							const cart = JSON.parse(storage.getItem("cart"));
							if (cart !== "") {
								Router.replace(cart.webUrl);
							}
						}}
					>
					Purchase
					</Button><br></br><small>CRYPTO ACCEPTED</small></>
					:
					<>
					<Button
						onClick={ async () => {
							const checkout = await client.checkout.create();
							const checkoutId = checkout.id;
							const lineItemsToAdd = [
								{
								variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MTA5NzU2Mjg4MjIxNg==",
								//regular variant id 
								quantity:1,
								//customAttributes: [{key: "MyKey", value: "MyValue"}]
								},
							];
							await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
							const exisitingcheckout = await client.checkout.fetch(checkoutId);
							Router.replace(exisitingcheckout.webUrl);
						}}
					>
					Purchase
					</Button><br></br><small>CRYPTO ACCEPTED</small></>


					}		




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
