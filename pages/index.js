import {client} from '../utils/shopify';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Input,Segment,Button,Header,Label,Sticky,Grid,Container, Card, List} from 'semantic-ui-react'
import { useState } from 'react';
import Router from 'next/router';



const {Row, Column} = Grid;


const Post = ({product,walletready}) => {

    
  const [image , setImage] = useState(product.images[0]);
  const [price, setPrice] = useState(0);
  const quantity  = 1;

  const applyDiscount = async()=>{
    
    const storage = window.localStorage;
    let checkoutId = storage.getItem('checkoutId');


    if(!checkoutId){
      const checkout = await client.checkout.create();
      checkoutId = checkout.id;
      storage.setItem('checkoutId', checkoutId);
    }

    const cart = await client.checkout.addDiscount(checkoutId, "SEEDHOLDER");
    storage.setItem('cart', JSON.stringify(cart));
    setPrice(cart.subtotalPrice);

  }

  const addToCart =async () =>{

    const storage = window.localStorage;
    let checkoutId = storage.getItem('checkoutId');


    if(!checkoutId){
      const checkout = await client.checkout.create();
      checkoutId = checkout.id;
      storage.setItem('checkoutId', checkoutId);
    }
    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity
        //customAttributes: [{key: "MyKey", value: "MyValue"}]
      }
    ];
    const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);

    storage.setItem('cart', JSON.stringify(cart));
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

        <><p>Lucien Smith<br></br>Acrylic paint on canvas<br></br> 8.5 x 10 in<br></br> 64 x 96 cm</p></>
        <p>{product.description}</p>

        <br></br>

        <span> 
          Price : {product.variants[0].price}<br></br>
          Subtotal: {price}<br></br>
        
         </span>

     
        {walletready !=="null" &&
          <Button onClick={() => applyDiscount()} >Apply Discount</Button><br></br>
        } 
        <Button onClick={() =>{
          const storage = window.localStorage;
          const cart = JSON.parse(storage.getItem("cart"));
          if (cart !== ""){
            Router.replace(cart.webUrl);
          }
        }}>CHECKOUT</Button>
        <Button onClick={() => addToCart()} >Add To Cart</Button>
        </Column>
      </Row>
    </Grid>
  
      
    
  )
}


export async function getServerSideProps(context) {

  const {req, query}=context
  const product = await client.product.fetchByHandle("carrot-seed-packet")
  const walletready = req.cookies.walletready

  return {
    props: { 
      product: JSON.parse(JSON.stringify(product)),
      walletready:walletready || "null",

    }, // will be passed to the page component as props
  }
}


export default Post