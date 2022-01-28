import { useState } from "react";
import Link from "next/link";
import { Container, Segment, Menu, Visibility } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "../styles/inter.css";
import "../styles/globals.css";
import Head from "next/head";
import { Provider as OnboardProvider } from "../contexts/Onboard";

import useWeb3 from "../hooks/useWeb3";
import useWalletCheckTrigger from "../hooks/useWalletCheckTrigger";




const Navbar = () => {
	const { connect, disconnect, account } = useWeb3();
	const [fixed, setFixed] = useState(false);

	const connected = Boolean(account);

	return (
		<Visibility once={false} onBottomPassed={() => setFixed(true)} onBottomPassedReverse={() => setFixed(false)}>
			<Segment textAlign="center" style={{ minHeight: 50, padding: "1em 2em" }}>
				<Menu fixed={fixed ? "top" : null} borderless>
					<Container>
						<Link href="/">
							<Menu.Item>Lucien Smith Studio</Menu.Item>
						</Link>

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
			<footer className="ui container">
				<Link href="https://www.instagram.com/feareatsthesoil/?hl=en">Instagram</Link>
				<br></br>
				<Link href="https://twitter.com/feareatsthesoil">Twitter</Link>
				<br></br>
				<Link href="https://luciensmithstudio.substack.com/">Substack</Link>
				<br></br>
				<br></br>
				©2022 Lucien Smith Studio. All rights reserved. <Link href="/privacy-policy">Privacy Policy</Link>
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
			<title>Lucien Smith Studio - Seed Painting</title>
			<meta property="og:title" content="Lucien Smith Studio - Seed Painting" key="title" />
			</Head>
	  
			<OnboardProvider>
				<Navbar />
				<Component {...pageProps} />
				<Footer />
			</OnboardProvider>
		</>
	);
}

export default MyApp;
