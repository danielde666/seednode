import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Segment, Button,Header,Label,Sticky,Grid,Container, Card} from 'semantic-ui-react'
import {client} from '../utils/shopify'
import styles from '../styles/Home.module.css'
import Router from 'next/router'
import { useState,useEffect } from 'react'

const {Row, Column} = Grid;

export default function Home(product,walletready,Grid) {
  
  const [image , setImage] = useState(product.images[0]);
  const quantity = 1;
  const [price, setPrice] = useState(product.variants[0].price);
  
  




  const applyDiscount = async()=>{

    const storage = window.localStorage;
    let checkoutId = storage.getItem('checkoutId');
    
    console.log(checkoutId);
  

    if(!checkoutId){
      const checkout = await client.checkout.create();
      checkoutId = checkout.id;
      storage.setItem('checkoutId', checkoutId);
    }
  
    const cart = await client.checkout.addDiscount(checkoutId, "SEEDHOLDER");
    storage.setItem('cart', JSON.stringify(cart));
    console.log(cart)
    setPrice(cart.subtotalPrice);
  }

  const addToCart =async () =>{

    
    const storage = window.localStorage;
    let checkoutId = storage.getItem('checkoutId');
    //console.log(checkoutId);
    if(!checkoutId){
      const checkout = await client.checkout.create();
      checkoutId = checkout.id;
      storage.setItem('checkoutId', checkoutId);
    }
    
    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity
      }
    ];

    const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    storage.setItem('cart', JSON.stringify(cart));
    console.log(cart)
    
    setPrice(cart.subtotalPrice);


    
  }

  return (
     <Grid container centered >
      <Row>
        <Column width={10}>
          <Row>
          <br>
          </br>
            <Image src={image.src}  width={500} height={500}/>
          </Row>
      
        </Column>

        <Column style={{marginTop:50}} width={6}>

        <Header as="h3">{product.title}</Header>
        <p>{product.description}</p>

        <br></br>

        <span> {price} </span>


        <br></br>
        <br></br>




      {walletready !=="null" &&
     
         <Button onClick={() => applyDiscount()} >Apply Discount</Button>
      }


       <Button onClick={() =>{


        const storage = window.localStorage;
        const cart = JSON.parse(storage.getItem("cart"));
        if (cart !== ""){
          Router.replace(cart.webUrl);
        }
      }}>CHECKOUT</Button>
  


        <Button onClick={addToCart()}>Add To Cart</Button>

   


        <br>
        
        </br>


        </Column>
      </Row>
    </Grid>
  )


}



export async function getServerSideProps(context) {

  const {req}=context
  const product = await client.product.fetchByHandle("carrot-seed-packet")
  const walletready = req.cookies.walletready
  

  return {
    props: { 
      product: JSON.parse(JSON.stringify(product)),
      walletready:walletready || "null",

    }, // will be passed to the page component as props
  }
}