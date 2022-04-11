import { React, useState } from "react";
import Link from "next/link";
import { Container, Segment, Menu, Visibility } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "../styles/gillsans.css";
import "../styles/globals.css";
import Head from "next/head";
import { Provider as OnboardProvider } from "../contexts/Onboard";
import Count from "../hooks/Count";
import useWeb3 from "../hooks/useWeb3";
import useWalletCheckTrigger from "../hooks/useWalletCheckTrigger";

const Counter = () => {
	return (
		<Count />
	);
  }
  

const Navbar = () => {
	const { connect, disconnect, account } = useWeb3();
	const [fixed, setFixed] = useState(false);

	const connected = Boolean(account);

	return (
		<Visibility once={false} onBottomPassed={() => setFixed(true)} onBottomPassedReverse={() => setFixed(false)}>
			<Segment textAlign="center" style={{ minHeight: 50, padding: "0px 10px",background:'transparent' }}>
				<Menu fixed={fixed ? "top" : null} borderless>
					<Container fluid>
						
							<Menu.Item><Link href="https://www.luciensmithstudio.com/"> Lucien Smith</Link></Menu.Item>
						

						<Menu.Item
							position="right"
							onClick={() => {
								connected ? disconnect() : connect();
							}}
						>
							{connected ? "CONNECTED" : "CONNECT WALLET"}
						</Menu.Item>
					</Container>
				</Menu>
			</Segment>
		</Visibility>
	);
};

const Footer = () => {
	return (
		<>
			<footer className="ui container fluid" style={{ textAlign:"center",minHeight: 50, padding: "0px 30px 0px" }}>
				
				<Link href="https://www.instagram.com/feareatsthesoil/?hl=en">Instagram</Link>
				• 
				<Link href="https://twitter.com/feareatsthesoil">Twitter</Link>
				
				<br></br>
				©2022 Lucien Smith Studio. All rights reserved. <Link href="https://www.luciensmithstudio.com/policies/privacy-policy">Privacy Policy</Link>
				<br></br>
			</footer>
		</>
	);
};

function MyApp({ Component, pageProps }) {
	useWalletCheckTrigger();

	return (
	
		<>
			<Head>
			<title>Lucien Smith Studio - Seed Date Painting(s)</title>
			<meta property="og:title" content="Lucien Smith Studio - Seed Date Painting(s)" key="title" />
			</Head>
	  
			<OnboardProvider>
				<Counter/>
				<Navbar />
				<Component {...pageProps} />
				<Footer />
			</OnboardProvider>
		</>
	);
}

export default MyApp;
