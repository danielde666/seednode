import {client} from '../utils/shopify';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {Input,Segment,Button,Header,Label,Sticky,Grid,Container, Card, List} from 'semantic-ui-react'
import { useState } from 'react';



const {Row, Column} = Grid;
const Cart = () => {



    
    const storage = window.localStorage;
    let checkoutId = storage.getItem('checkoutId');
   
   



    
    return (
        
      <Grid container centered >
        <Row>
        
        </Row>
      </Grid>
  
    )
  }


  
  
  export default Cart