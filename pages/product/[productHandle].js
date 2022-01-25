import {client} from '../../utils/shopify';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Input,Segment,Button,Header,Label,Sticky,Grid,Container, Card, List} from 'semantic-ui-react'
import { useState } from 'react';
import cookieCutter from 'cookie'
import Router from 'next/router';



const {Row, Column} = Grid;


const Post = ({product}) => {

  const [price, setPrice] = useState(product.variants[0].price);
  const [cartUrl, setUrl] = useState(window.location.pathname);

  
  const walletready = cookieCutter.get('walletready'); 



  async function addtoCart (){


    if(!checkoutId){
      const cart = await client.checkout.create();
      const checkoutId = cart.id;
      cookieCutter.set('checkoutId', checkoutId);
    }
    if (checkoutI){
      const lineItemsToAdd = [
        {
          variantId: product.variants[0].id,
          quantity: 1
        }
      ];
      const updatedcart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
      const carttotal = updatedcart.subtotalPrice;
      const cartUrl = updatedcart.checkoutUrl;
      cookieCutter.set('carttotal', carttotal);
      cookieCutter.set('cartUrl', cartUrl);
      setPrice(carttotal);
      setUrl(cartUrl);
      Router.push(window.location.pathname)
    }
  }
  
  async function applyDiscount (){
    
    if(!checkoutId){
      const cart = await client.checkout.create();
      const checkoutId = cart.id;
      cookieCutter.set('checkoutId', checkoutId);
    }
    if (checkoutId){
      const discountedcart = await client.checkout.addDiscount(checkoutId, "SEEDHOLDER");
      const discountedcarttotal = discountedcart.subtotalPrice;
      const discountedcarturl = discountedcart.checkoutUrl;
      cookieCutter.set('discountedcarttotal', discountedcarttotal);
      cookieCutter.set('discountedcarturl', discountedcarturl);
      setPrice(carttotal);
      setUrl(discountedcarturl);
      Router.push(window.location.pathname)
    }
  }
  
  







  return (
    <Grid container centered >
      <Row>
        <Column width={10} marginTop={40}>
          <Row>
            <Image src={product.images[0].src}  width={500} height={500}/>
          </Row>
        </Column>

        <Column style={{marginTop:50}} width={6}>

        <Header as="h3">{product.title}</Header>
      <> <p>{product.description}</p>
         <br></br>
        <span>PRICE: {product.variants[0].price}
         <br></br>
          SUBTOTAL: {price}
          </span>
      </>
      {walletready  &&
        <Button onClick={() => applyDiscount()} >Apply Discount</Button>
      }
      {cartUrl && 
        <Button onClick={() =>{
                Router.replace({cartUrl});
          }}>CHECKOUT</Button>
      }

        
        <Button onClick={() => addtoCart()} >Add to Cart</Button>

        </Column>
      </Row>
    </Grid>

  )
}

export async function getServerSideProps(context) {

  const {req, query}=context
  const productHandle = query.productHandle
  const product = await client.product.fetchByHandle(productHandle)

  return {
    props: { 
      product: JSON.parse(JSON.stringify(product)),
    
    }, // will be passed to the page component as props
  }
}


export default Post