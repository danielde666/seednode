import { client } from '../../utils/shopify';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Input, Segment, Button, Header, Label, Sticky, Grid, Container, Card, List } from 'semantic-ui-react'
import { useState } from 'react';



import Router from 'next/router';



const { Row, Column } = Grid;
const Post = ({ product, checkoutID, walletready }) => {


  const [image, setImage] = useState(product.images[0]);


  const [price, setPrice] = useState(product.variants[0].price);




  const [quantity, setQuantity] = [1];


  const applyDiscount = async (checkoutID) => {





    //console.log(checkoutId);
    if (checkoutID !== "null") {


      const checkout = await client.checkout.create();
      checkout = checkout.id;

      fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: checkoutId })
      })



    }







    // const storage = window.localStorage;
    // let checkoutId = storage.getItem('checkoutId');

    // console.log(checkoutId);


    // if(!checkoutId){
    //   const checkout = await client.checkout.create();
    //   checkoutId = checkout.id;
    //   storage.setItem('checkoutId', checkoutId);
    // }

    const cart = await client.checkout.addDiscount(checkoutID, "SEEDHOLDER");
    // storage.setItem('cart', JSON.stringify(cart));
    //console.log(cart)



    setPrice(cart.subtotalPrice);







  }





  const addToCart = async (checkoutID) => {


    let checkoutId = checkoutID;



    //console.log(checkoutId);
    if (checkoutId !== "null") {


      const checkout = await client.checkout.create();
      checkoutId = checkout.id;

      fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: checkoutId })
      })



    }

    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity
        //customAttributes: [{key: "MyKey", value: "MyValue"}]
      }
    ];




    const cart = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);

    fetch("/api/savecart", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: cart })
    })

    Router.reload(window.location.pathname);


  }




  return (
    <Grid container centered >
      <Row>
        <Column width={10}>
          <Row>
            <br>
            </br>
            <Image src={image.src} width={500} height={500} />
          </Row>
          {/* <Row>
            <List horizontal divided>
              {product.images.map((image, index) => {
                return  (

                <List.Item onClick={() => setImage(image)}>
                  <Image  src={image.src} size={'small'} width={100} height={100}/>
                </List.Item>
                )
              })}
            </List>
          </Row> */}
        </Column>

        <Column style={{ marginTop: 50 }} width={6}>

          <Header as="h3">{product.title}</Header>
          <p>{product.description}</p>

          <br></br>

          <span> {price}

          </span>


          <br></br>
          <br></br>




          {walletready !== "null" &&

            <Button onClick={() => applyDiscount()} >Apply Discount</Button>
          }


          {checkoutID !== "null" &&


            <Button onClick={async () => {



              // const storage = window.localStorage;
              const carturl = await client.checkout.fetch(checkoutID);


              Router.replace(carturl.webUrl);


            }}>CHECKOUT</Button>
          }








          <br></br>
          <br></br>















          <Input
            action={{
              color: 'black',
              labelPosition: 'left',
              icon: 'cart',
              content: 'Add to Cart',
              onClick: addToCart
            }}
            onChange={(e, { value }) => setQuantity(Number(value))}
            type='number'
            actionPosition='left'
            placeholder='1'
            defaultValue='1'
            value="1"
            style={{ marginTop: 20 }}
          />



          <br>

          </br>


        </Column>
      </Row>
    </Grid>

  )
}

export async function getServerSideProps(context) {

  const { req, query } = context

  const productHandle = query.productHandle
  const product = await client.product.fetchByHandle(productHandle)

  const checkout = req.cookies.checkoutID

  const cart = req.cookies.cart


  const walletready = req.cookies.walletready




  console.log(product)
  console.log(checkout)


  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      checkoutID: checkout || "null",

      walletready: walletready || "null",

    }, // will be passed to the page component as props


  }


}






export default Post