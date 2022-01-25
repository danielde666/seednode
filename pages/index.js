import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Segment, Button,Header,Label,Sticky,Grid,Container, Card} from 'semantic-ui-react'
import {client} from '../utils/shopify'
import styles from '../styles/Home.module.css'
import Router from 'next/router'
import { useState,useEffect } from 'react'


export default function Home({product},checkoutID,walletready) {

  const {Row, Column} = Grid;
  const [checkout, setCheckout] = useState(null);
  const [checkoutURL, setCheckoutURL] = useState(null);

  useEffect(() => {

    const getShopifyCheckoutURL = async () => {
      const checkoutId = checkoutID;
      const lineItemsToAdd = [
        {
          variantId: product.variants[0].id,
          quantity:"1"
        }
      ];

      const savedCheckout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);

      setCheckout(savedCheckout);
      setCheckoutURL(savedCheckout.weburl);
    }; 


    const createCheckout= async () => {
      const checkout =  await client.checkout.create();
      checkoutId = checkout.id;
      
      fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: checkoutId })
      })
      getShopifyCheckoutURL(checkoutId);

    }

    if (checkout === null ) {

        createCheckout();

    }

  }, [checkout]);

  return (
    <Grid container centered >
      <Row>
        <Column width={10}>
          <Row>
            <Image src={product.images[0]}  width={500} height={500}/>
          </Row>
        </Column>

        <Column style={{marginTop:50}} width={6}>
          <Header as="h3">{product.title}</Header>
          <p>{product.description}</p>

          {checkout ? 'checkout' : 'none'}

          

          
          {walletready !== null && (
            <button
            onClick={async () => {
            await client.checkout.addDiscount(checkoutID, "SEEDHOLDER");
            setPrice(cart.subtotalPrice);
            }}
            >
            Discount
          </button>
          )}

          {checkout ? <Button onClick= {getShopifyCheckoutURL()}>Add To Cart</Button> : <Button onClick= {createCheckout()}>Add To Cart</Button> }
        



        </Column>
      </Row>
    </Grid>
  )


}



export async function getServerSideProps(context) {

  const {req}=context
  const product = await client.product.fetchByHandle("carrot-seed-packet")
  const checkout = req.cookies.checkoutID
  const walletready = req.cookies.walletready
  
  console.log(product)
  console.log(checkout)

  return {
    props: { 
      product: JSON.parse(JSON.stringify(product)),
      checkoutID:checkout || "null",
      walletready:walletready || "null",

    }, // will be passed to the page component as props
  }
}