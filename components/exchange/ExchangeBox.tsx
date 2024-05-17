'use cliente';

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import Limit from "components/exchange/buy/limit";
import Market from "components/exchange/buy/market";
import StopLimit from "components/exchange/buy/stopLimit";
import SellLimit from "components/exchange/sell/limit";
import SellMarket from "components/exchange/sell/market";
import SellStopLimit from "components/exchange/sell/stopLimit";
import Script from 'next/script';
import {sellMarket, buyMarket} from './marketMakerJs/buySell';
// import { useGlobalContext } from "./marketMakerJs/store";

interface Data {
  id: number;
  OpenPrice: number;
  quantity: number;
  side: number;
  symbol: string;
  close: number;
  usuId: number;
  netPL: number;
  currentPrice: number;
  stop: number;
  profit: number;
  time: string;
  created_at: string;
  updated_at: string;
}

interface ExchangeBoxProps {
  onData: (data: Data) => void;
}

const ExchangeBox: React.FC<ExchangeBoxProps> = ({ onData }) => {

  // const { price, setPrice, data, setData} = useGlobalContext();


  const sellMarketReact = () => {
    const result = sellMarket();
    console.log('data: ', result);
    onData(result);
  }
  
  // useEffect(() => {}, []);

  // const buyMarket = () => {
  //   setPrice(125);
  //   setData([
  //       { symbol: 'AAPL',
  //         side: 'LONG',
  //         quantity: 200,
  //         openPrice: 125,
  //         currentPrice: 125.1,
  //         netPL: 10,
  //         usuId: 1,
  //         tradeId: 1},
  //       { symbol: 'MSFT',
  //         side: 'LONG',
  //         quantity: 200,
  //         openPrice: 320,
  //         currentPrice: 321.5,
  //         netPL: 115,
  //         usuId: 1,
  //         tradeId: 2}
  //   ])
  //   console.log('data: ', data, price);
  // };
  const buyMarketReact = () => {
    const result = buyMarket();
    console.log('data: ', result);
    onData(result);
  }

  return (
    <>
    <link rel="stylesheet" href="marketStyle.css" />
    <div className="exchange-box order-box">
      <div style={{height: "400px", width: "300px"}}>
        <div className="contenedor" style={{padding: "20px"}}>
          <div className="market-options" style={{display: "flex", marginBottom: "20px"}}>
            
            <button style={{
                      flexGrow: "1",
                      height: "23px",
                      width: "30%",
                      color: "white",
                      background: "#70707085",
                      border: "0",
                      borderRadius: "2px",
                      fontSize: "10px",
                      marginRight: "7px",
                      cursor: "pointer"
            }}>Market</button>
            <button style={{
                      flexGrow: "1",
                      height: "23px",
                      width: "30%",
                      color: "white",
                      background: "#70707085",
                      border: "0",
                      borderRadius: "2px",
                      fontSize: "10px",
                      marginRight: "7px",
                      cursor: "pointer",
                      display: "none"
            }}>Limit</button>
            <button style={{
                      flexGrow: "1",
                      height: "23px",
                      width: "30%",
                      color: "white",
                      background: "#70707085",
                      border: "0",
                      borderRadius: "2px",
                      fontSize: "10px",
                      marginRight: "7px",
                      cursor: "pointer",
                      display: "none"
          }}>Stop Limit</button>
          </div>
          <div className="quantity" style={{marginTop: "40px"}}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "15px"
            }}>
              <span style={{fontSize: "13px"}}>Symbol</span>
              <input type="text" id="symbol-stock-us-id" style={{
                width: "100%",
                border: "1px solid #aaaa",
                borderRadius: "2px",
                background: "#70707085",
                color: "white",
                fontSize: "11px",
                height: "20px",
              }} readOnly/>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "15px"
            }}>
              <span style={{fontSize: "13px"}}>Quantity</span>
              <input type="number" id="market-maker-input-quantity-id" style={{
                width: "100%",
                border: "1px solid #aaaa",
                borderRadius: "2px",
                background: "#70707085",
                color: "white",
                fontSize: "11px",
                height: "20px"
              }}/>
            </div>
            <div>
              <span style={{fontSize: "13px"}}>Price</span>
              <input type="number" id="market-maker-input-price-id" style={{
                width: "100%",
                border: "1px solid #aaaa",
                borderRadius: "2px",
                background: "#70707085",
                color: "white",
                fontSize: "11px",
                height: "20px"
              }}/>
            </div>
          </div>
          <div className="buttons-box" style={{
            marginTop: "100px",
            display: "flex",
            justifyContent: "space-evenly"
          }}>
            <button id="buyButton" onClick={buyMarketReact} style={{
              height: "23px",
              width: "35%",
              color: "white",
              background: "#0ab20a",
              border: "0",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}>BUY</button>
            <button id="sellButton" onClick={sellMarketReact} style={{
              height: "23px",
              width: "35%",
              color: "white",
              background: "#e21717",
              border: "0",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}>SELL</button>
          </div>
        </div>
      </div>
    </div>
    <Script src="marketMakerJs/buySell.js"></Script>
    </>
  );
};

export default ExchangeBox;
