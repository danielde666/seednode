
import { useStae, useEffect, useState} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { 
  Button, 
  Container, 
  Grid, 
  Header, 
  Image, 
  Segment, 
  List, 
  Menu, 
  Sidebar, 
  Visibility
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/globals.css';
import { Component } from 'react';
import Onboard from 'bnc-onboard'
import Web3 from 'web3';
import { withRouter } from 'next/router'
import cookieCutter from 'cookie-cutter'




let web3;

const onboard = Onboard({
  dappId: "73bcf726-b226-4f5b-95a0-0081eb9d252d",
  networkId:4,
  subscriptions:{
    wallet: wallet => {
      web3 = new Web3(wallet.provider);
      console.log(`${wallet.name} is now connected`)

      
    }
  }
});

async function login (props){
  await onboard.walletSelect();
  const readyToTransact = await onboard.walletCheck();
  cookieCutter.set('walletready', readyToTransact);
  if (readyToTransact){
    Router.push(window.location.pathname)
  }
}

async function logout (){
  await onboard.walletReset()
}








const Navbar = (walletready) => {
  
  const [fixed, setFixed] = useState(false);


  return (
  <Visibility
    once={false}
    onBottomPassed={() => setFixed(true)}
    onBottomPassedReverse={() =>setFixed(false)}
  >
    <Segment
    textAlign='center'
    style={{minHeight:50,padding:'1em 2em'}}
    >
      <Menu
        fixed={fixed ? "top" : null}
        borderless
      >
        <Container>
          <Link href="/">
            <Menu.Item>Lucien Smith Studio </Menu.Item>
          </Link>
          <Menu.Item position='right'  onClick={login} >
             CONNECT WALLET
          </Menu.Item>
        </Container>
      </Menu>
    </Segment>
  </Visibility>
  )
}


const Footer = () =>{
  return(

    <>

    <footer>
    <div class="grid__item one-whole text-left">
      <div class="sociallinks">

        <a href="https://www.instagram.com/feareatsthesoil/?hl=en" target="_blank"><span>Instagram</span></a>
        <a href="https://twitter.com/feareatsthesoil" target="_blank"><span>Twitter</span></a>

        <a href="https://luciensmithstudio.substack.com/" target="_blank" rel="noreferrer noopener">Substack</a>


      </div>
      <span class="copyright">©2022 Lucien Smith Studio. All rights reserved. 
        <a href="/privacy-policy"><span>Privacy Policy</span></a></span>
    </div>    </footer>
    
    
    </>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar/>
      <Component {...pageProps} />
      <Footer/>
    </>
  )
}



export async function getServerSideProps(context) {


  const cookies = req.cookies
  const walletready = req.cookies.walletready



  return {
    props: { 
      product: JSON.parse(JSON.stringify(walletready)) || "",
      

    }, // will be passed to the page component as props
    

  }


}




export default MyApp
