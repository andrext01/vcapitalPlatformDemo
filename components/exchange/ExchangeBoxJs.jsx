'use cliente';
import React from 'react';
import {sellMarket, buyMarket} from './marketMakerJs/buySell';

const ExchangeBoxJs = ({ onData, isButtonDisabled  }) => {

    const sellMarketReact = () => {
        const buttonSell = document.getElementById('sellButton');
        const buttonBuy = document.getElementById('buyButton');
        if (buttonSell && !buttonSell.disabled &&
            buttonBuy && !buttonBuy.disabled) { 
                buttonBuy.disabled = true;
                buttonSell.disabled = true;
        }
        const result = sellMarket();
        console.log('data: ', result);
        onData(result);
    }
    const buyMarketReact = () => {
        const buttonSell = document.getElementById('sellButton');
        const buttonBuy = document.getElementById('buyButton');
        if (buttonSell && !buttonSell.disabled &&
            buttonBuy && !buttonBuy.disabled) { 
                buttonBuy.disabled = true;
                buttonSell.disabled = true;
        }
        const result = buyMarket();
        console.log('data: ', result);
        onData(result);
    }
    return (
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
                    <input type="number" id="market-maker-input-quantity-id" max={500} style={{
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
                    }} readOnly/>
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
    );
};

export default ExchangeBoxJs;
