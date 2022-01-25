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