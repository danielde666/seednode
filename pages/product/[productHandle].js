import {client} from '../../utils/shopify';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Input,Segment,Button,Header,Label,Sticky,Grid,Container, Card, List} from 'semantic-ui-react'
import { useState } from 'react';
import cookieCutter from 'cookie-cutter'
import Router from 'next/router';



const {Row, Column} = Grid;
const Post = ({product}) => {
const walletready = cookieCutter.get('walletready'); 
const checkoutId = cookieCutter.get('checkoutID');  
const  carttotal= cookieCutter.get('carttotal');  
const cartUrl = cookieCutter.get('cartUrl');  
const [image , setImage] = useState(product.images[0]);
const [price, setPrice] = useState(carttotal);
const[quantity, setQuantity] = [1];

const applyDiscount = async()=>{
 
  console.log(checkoutId);

  if(!checkoutId){
    const checkout = await client.checkout.create();
    checkoutId = checkout.id;
    cookieCutter.set('checkoutId', checkoutId);
  }
  const cart = await client.checkout.addDiscount(checkoutId, "SEEDHOLDER");
  const carttotal = cart.subtotalPrice;
  const cartUrl = cart.checkoutUrl;
  cookieCutter.set('carttotal', carttotal);
  cookieCutter.set('cartUrl', cartUrl);
  setPrice(carttotal);
  
  Router.reload(window.location.pathname);

}





const addToCart =async () =>{

  if(!checkoutId){
    const checkout = await client.checkout.create();
    checkoutId = checkout.id;
    cookieCutter.set('checkoutId', checkoutId);
  }
  const lineItemsToAdd = [
    {
      variantId: product.variants[0].id,
      quantity
    }
  ];
  const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
  const carttotal = cart.subtotalPrice;
  const cartUrl = cart.checkoutUrl;
  cookieCutter.set('carttotal', carttotal);
  cookieCutter.set('cartUrl', cartUrl);

  Router.reload(window.location.pathname);
}




  return (
    <Grid container centered >
      <Row>
        <Column width={10} marginTop={40}>
          <Row>
            <Image src={image.src}  width={500} height={500}/>
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
                Router.replace(cartUrl);
          }}>CHECKOUT</Button>
      }

        <Input
          action={{
            color: 'black',
            labelPosition: 'left',
            icon: 'cart',
            content: 'Add to Cart',
            onClick:addToCart
          }}
          onChange={(e, {value})=>setQuantity(Number(value))}
          type='number'
          actionPosition='left'
          placeholder='1'
          defaultValue='1'
          value="1"
          style={{marginTop:20}}
        />
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