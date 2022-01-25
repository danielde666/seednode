import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Segment, Button,Header,Label,Sticky,Grid,Container, Card} from 'semantic-ui-react'
import {client} from '../utils/shopify'
import styles from '../styles/Home.module.css'
import Router from 'next/router'

const {Row, Column} = Grid;

export default function Home({product},checkoutID,walletready) {


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

          
          {walletready !=="null" &&
          <Button onClick={() => applyDiscount()} >Apply Discount</Button>
          }

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