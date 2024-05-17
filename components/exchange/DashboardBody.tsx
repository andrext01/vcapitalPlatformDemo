'use client'

import React, { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import AllSellOrders from "./AllSellOrders";
import AllSellOrdersFull from "./AllSellOrdersFull";
import ExchangeBox from "./ExchangeBox";
import ExchangeBoxJs from './ExchangeBoxJs';
import TradesHistory from "./TradesHistory";
import AllBuyOrders from "./AllBuyOrders";
import AllBuyOrdersFull from "./AllBuyOrdersFull";
import dynamic from "next/dynamic";
import OrderHistorySection from "./orderHistorySection";
import useTranslation from "next-translate/useTranslation";
import ExchangeBoxBottom from "./ExchangeBoxBottom";
import SelectCurrencyRight from "./selectCurrencyRight";
import { GlobalContextProvider } from "./marketMakerJs/store";
import { editQuantity, closeTradeByMarket, editProfitStopCell } from "./marketMakerJs/watchTrades";
import {setNetPL} from "./marketMakerJs/stopProfitMarket";
// import SocketComponent from "./marketMakerJs/tableOpenedOrders";
// import { io } from "socket.io-client";
import Modal from "./modalStopProfit.jsx";
import {fetchDataSGA, fetchOrderSGA, fetchSetSGA, fetchSetOrderSGA, fetchUpdateTrade} from './marketApi/marketApi';
import {onTradeTracking} from "./marketMakerJs/stopProfitMarket"
import {
  EXCHANGE_LAYOUT_ONE,
  EXCHANGE_LAYOUT_TWO,
} from "helpers/core-constants";
import { useGlobalContext } from "./marketMakerJs/store";
import {setLocalStorageItem, getLocalStorageItem} from "./marketMakerJs/buySell";
import { TradeList } from "components/TradeList";
import { useRouter } from 'next/router';
import {unSubscribeSymbol, socket} from './api/vcapitalStreaming';
import {updateBalance} from './marketApi/balanceApi';

// const marketSocket = io("https://websocketvcapital.academyedupro.com")

const TradingChart = dynamic(
  () =>
    import("components/exchange/TradingChart").then(
      (mod: any) => mod.TVChartContainer
    ),
  { ssr: false }
);

interface Data {
  OpenPrice: number;
  id: number;
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

interface Order {
  id: number;
  idTrade: number;
  openprice: number;
  time: string;
  symbol: string;
  side: number;
  quantity: number;
  type: number; //0 - order Market, 1 - order STOP, 2 - order Profit
  usuId: number;
  created_at: string;
  updated_at: string;
}

interface stopProfit {
  price: number,
  type: string
}

interface Tracking {
  typeBlock: string,
  typeOrder: number,
  side: number
}


const DashboardBody = () => {
  
  const showAlertToast = (message: string) => {
    toast.warn(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  
  const newTradeConditions = (newTrade: Data) => {
    let resp = false;
    if(newTrade.quantity > 500) {
      showAlertToast('La cantidad de lotes es mayor a la permitida (5 Lotes)');
      resp = true;
    } else if(!newTrade.OpenPrice) {
      showAlertToast('La orden no tiene precio');
      resp = true;
    } else if(!newTrade.quantity) {
      showAlertToast('La orden no tiene número de lotes');
      resp = true;
    } else if(newTrade.quantity*newTrade.OpenPrice > 50000) {
      showAlertToast('El costo de la orden excede el poder de compra');
      resp = true;
    }
    if(resp) disabledSellAndBuyButton(2);
    return resp;
  }
  
  const setBuyPowerStorage = (price: number, quantity: number) => {
    let buyPowerStorage = parseFloat(localStorage.getItem('buyPower') || "0");

    buyPowerStorage = buyPowerStorage - price*quantity;
    localStorage.setItem('buyPower', buyPowerStorage.toString());
  }
 
  const buyPowerConditions = (order: Data) => { // validating the buyPower
    let resp = false;
    console.log('buyPower into Function condition: ', buyPower);
    console.log('daata into buyPower function: ', order);
    let buyPowerStorage = parseFloat(localStorage.getItem('buyPower') || "0");
    console.log('BUY POWER ON LOCAL STORAGE', buyPowerStorage);
    
    // if(order.OpenPrice*order.quantity + buyPower < 50000){
    if(order.OpenPrice*order.quantity + buyPowerStorage < 50000){
      buyPowerStorage += order.OpenPrice*order.quantity;
      console.log('BUY POWER after plus', buyPowerStorage);
      localStorage.setItem('buyPower', buyPowerStorage.toString());
      setbuyPower(buyPower + order.OpenPrice*order.quantity);
    } else {
      showAlertToast('El costo de la orden excede el poder de compra');
      disabledSellAndBuyButton(2);
      resp = true;
    }
    console.log('buyPower into Function condition: ', buyPower, resp);
    return resp;
  }
  
  // if (typeof window !== 'undefined') {
  //   const router = useRouter();
  //   router.push('/signin');
  // }
  
  
  const openedTradesRef = useRef<HTMLTableElement>(null);
  const closedTradesRef = useRef<HTMLTableElement>(null);
  // const openedTableRef = openedTradesRef.current;
  // const closedTableRef = closedTradesRef.current;
  
  const [rowData, setRowData] = React.useState<Data[]>([]);
  const [ordersData, setOrdersData] = React.useState<Order[]>([]);
  // const [balance, setBalance] = React.useState<number>(0);
  const [buyPower, setbuyPower] = useState(0);
  
  useEffect(() => {
    localStorage.setItem('buyPower', "0");
    
    const getTrades = async () => {
      const dataApi = await fetchDataSGA();
      const dataTrades = dataApi.data;
      console.log('postData: ', dataTrades);
      if(dataTrades && dataTrades.length !== 0){
        setRowData(dataTrades);
        // showing the trade on the opened and close watch trades
        dataTrades.map((trade: Data) => {
          if(trade.close === 0) {
            // const openedTableRef = openedTradesRef.current;
            buyPowerConditions(trade);
            addOpenedTrade(trade);
          } else {
            // const closedTableRef = closedTradesRef.current;
            addClosedTrade(trade);
          }
        })
        localStorage.setItem('tradeList', JSON.stringify(dataTrades));
      } else {
        localStorage.setItem('tradeList', '');
      }
    }
    const getOrders = async () => {
      const dataOrders = await fetchOrderSGA();
      console.log('dataOrders: ', dataOrders.data);
      if(dataOrders.status === true && dataOrders.data.length !== 0){
        setOrdersData(dataOrders.data);
        localStorage.setItem('ordersList', JSON.stringify(dataOrders.data));
      } else {
        localStorage.setItem('ordersList', '');
      }
    }

    localStorage.setItem('daily_netPl', "0");
    getTrades();
    getOrders();
  }, [])


  // useEffect(() => {
  //   let dataTrades
  //   dataTrades = localStorage.getItem('tradeList') || ""
  //   if(dataTrades !== ""){
  //     const tradeList = JSON.parse(dataTrades);
  //     setRowData(tradeList);
  //     // showing the trade on the opened and close watch trades
  //     tradeList.map((trade: Data) => {
  //       if(trade.close === 0) {
  //         // const openedTableRef = openedTradesRef.current;
  //         addOpenedTrade(trade);
  //       } else {
  //         // const closedTableRef = closedTradesRef.current;
  //         addClosedTrade(trade);
  //       }
  //     })
  //   };
  //   console.log('localstorage dataTrade: ',dataTrades)
  //   console.log('initial dataTrades: ', rowData);
    
  // }, [])

  const addOpenedTrade = (tradeFromApi: Data) => {
    const trade = {
      OpenPrice: tradeFromApi.OpenPrice,
      id: tradeFromApi.id,
      quantity: tradeFromApi.quantity,
      side: tradeFromApi.side,
      symbol: tradeFromApi.symbol,
      close: tradeFromApi.close,
      usuId: tradeFromApi.usuId,
      netPL: tradeFromApi.netPL,
      currentPrice: '',
      stop: tradeFromApi.stop,
      profit: tradeFromApi.profit,
      time: tradeFromApi.time
    }
    const table = openedTradesRef.current;
    if(table) {
        const tbody = table.querySelector('tbody');
        if(!tbody) return;

        const newRow = tbody.insertRow();
        newRow.id = `opened-row-${trade.symbol}-id`;
        let sideText = '';
      
        const newCell1 = newRow.insertCell();
        const newCell2 = newRow.insertCell();
        const newCell3 = newRow.insertCell();
        const newCell4 = newRow.insertCell();
        const newCell5 = newRow.insertCell();
        const newCell6 = newRow.insertCell();
        const newCell7 = newRow.insertCell();
        const newCell8 = newRow.insertCell();
        const newCell9 = newRow.insertCell();
        const button = document.createElement('button');
        button.textContent = '+';
        button.addEventListener('click', () => {
          adminStopProfit(trade.id);
        });
        button.style.width = '90%';
        button.style.height = '90%';
        button.style.border = '0';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = 'azure';
        
        if(trade.side === 1) {
          sideText = 'LONG';
          newCell2.style.color = '#1DEE00';
        } else {
          sideText = 'SHORT';
          newCell2.style.color = '#FF0000';
        }
        newCell8.style.color = trade.netPL >= 0 ? '#1DEE00' : '#FF0000';
      
        newCell1.textContent = trade.symbol;
        newCell2.textContent = sideText;
        newCell3.textContent = trade.quantity.toString();
        newCell4.textContent = trade.OpenPrice.toString();
        newCell5.textContent = trade.currentPrice;
        newCell5.id = `td-${trade.symbol}-currentPrice-id`; // asign id to current price cell
        newCell6.textContent = trade.stop.toString();
        newCell7.textContent = trade.profit.toString();
        newCell8.textContent = trade.netPL.toString();
        newCell8.id = `td-${trade.symbol}-netPL-id`; // asign id to current price cell
        newCell9.appendChild(button);
    }
  }

  const addClosedTrade = (trade: Data) => {
    const table = closedTradesRef.current;
      if(table) {
        const tbody = table.querySelector('tbody');
        if(!tbody) return;
        const newRow = tbody.insertRow();
        let sideText = '';
      
        const symbolCell = newRow.insertCell();
        const sideCell = newRow.insertCell();
        const quantityCell = newRow.insertCell();
        const priceEntryCell = newRow.insertCell();
        const stopCell = newRow.insertCell();
        const profitCell = newRow.insertCell();
        const netPLCell = newRow.insertCell();
        
        if(trade.side === 1) {
          sideText = 'LONG';
          sideCell.style.color = '#1DEE00';
        } else {
          sideText = 'SHORT';
          sideCell.style.color = '#FF0000';
        }
        netPLCell.style.color = trade.netPL >= 0 ? '#1DEE00' : '#FF0000';
      
        symbolCell.textContent = trade.symbol;
        sideCell.textContent = sideText;
        quantityCell.textContent = trade.quantity.toString();
        priceEntryCell.textContent = trade.OpenPrice.toString();
        stopCell.textContent = trade.stop.toString();
        profitCell.textContent = trade.profit.toString();
        netPLCell.textContent = trade.netPL.toString();
    }
  }

  // const addOpenedTrade = (trade: Data) => {
  //   const table = tableRef.current;
  //   if(table) {
  //       const newRow = table.insertRow();
  //       let sideText = '';
      
  //       const newCell1 = newRow.insertCell();
  //       const newCell2 = newRow.insertCell();
  //       const newCell3 = newRow.insertCell();
  //       const newCell4 = newRow.insertCell();
  //       const newCell5 = newRow.insertCell();
  //       const newCell6 = newRow.insertCell();
  //       const newCell7 = newRow.insertCell();
  //       const newCell8 = newRow.insertCell();
  //       const newCell9 = newRow.insertCell();
  //       const button = document.createElement('button');
  //       button.textContent = '+';
  //       button.addEventListener('click', () => {
  //         adminStopProfit(trade.id);
  //       });
        
  //       if(trade.side === 1) {
  //         sideText = 'LONG';
  //         newCell2.style.color = '#1DEE00';
  //       } else {
  //         sideText = 'SHORT';
  //         newCell2.style.color = '#FF0000';
  //       }
  //       newCell8.style.color = trade.netPL >= 0 ? '#1DEE00' : '#FF0000';
      
  //       newCell1.textContent = trade.symbol;
  //       newCell2.textContent = sideText;
  //       newCell3.textContent = trade.quantity.toString();
  //       newCell4.textContent = trade.OpenPrice.toString();
  //       newCell5.textContent = trade.currentPrice.toString();
  //       newCell5.id = `td-${trade.symbol}-currentPrice-id`; // asign id to current price cell
  //       newCell6.textContent = trade.stop.toString();
  //       newCell7.textContent = trade.profit.toString();
  //       newCell8.textContent = trade.netPL.toString();
  //       newCell9.appendChild(button);
  //   }
  // }

    // marketSocket.on("message", (message: string) => {
    //   console.log("MarketClient message: ", message); // message send from server
    //   if(!message) return;
    //   const symbolEvent = JSON.parse(message);
    //   const storageTrades = JSON.parse(localStorage.getItem('tradeList') || "[]")
    //   //const storageTrades = rowData;
    //   //console.log('storageTrades: ', storageTrades);
    //   if(storageTrades.length == 0) return;

    //   for(let i=0; i<storageTrades.length; i++) {
    //     const trade = storageTrades[i];
    //     if(trade.symbol === symbolEvent.s && trade.close === 0) {
    //       trade.currentPrice = parseFloat(symbolEvent.p);
    //       const tracking: Tracking = onTradeTracking(trade.side, trade.stop, trade.profit, symbolEvent.p);
    //       console.log('tracking: ', tracking.typeOrder);
    //       if (tracking.typeOrder !== 0) {
    //         const listOrders = JSON.parse(localStorage.getItem('ordersList') || "[]")
    //         const newOrder: Order = {
    //           idTrade: i,
    //           openprice: symbolEvent.p,
    //           time: new Date(),
    //           symbol: trade.symbol,
    //           side: tracking.side,
    //           quantity: trade.quantity,
    //           type: tracking.typeOrder
    //         }
    //         listOrders.push(newOrder);
    //         trade.close = 1;
    //         trade.quantity = 0;
    //         // localStorage.setItem('ordersList', JSON.stringify([listOrders]));
    //         localStorage.setItem('ordersList', JSON.stringify(listOrders));
    //       }
    //     }
    //   }


      // const currentListTrades = storageTrades.map((trade: Data, index: number) => {
      //   console.log('entered on map');
        // if(trade.symbol === symbolEvent.s && trade.close === 0) {
        //   trade.currentPrice = parseFloat(symbolEvent.p);
        //   const tracking: Tracking = onTradeTracking(trade.side, trade.stop, trade.profit, symbolEvent.p);
        //   console.log('tracking: ', tracking.typeOrder);
        //   if (tracking.typeOrder !== 0) {
        //     const listOrders = JSON.parse(localStorage.getItem('ordersList') || "[]")
        //     const newOrder: Order = {
        //       idTrade: index,
        //       openprice: symbolEvent.p,
        //       time: new Date(),
        //       symbol: trade.symbol,
        //       side: tracking.side,
        //       quantity: trade.quantity,
        //       type: tracking.typeOrder
        //     }
        //     listOrders.push(newOrder);
        //     trade.close = 1;
        //     trade.quantity = 0;
        //     // localStorage.setItem('ordersList', JSON.stringify([listOrders]));
        //     localStorage.setItem('ordersList', JSON.stringify(listOrders));
        //   }
        // }
      //   return trade;
      // });
      // console.log('currentListTrades: ', JSON.stringify(currentListTrades));
      // localStorage.setItem('tradeList', JSON.stringify(currentListTrades));
      // setRowData(currentListTrades);
      // console.log(rowData);
    // });

    // marketSocket.on("disconnect", () => {
    //     console.log(marketSocket.id); // undefined
    // });

  



  const { t } = useTranslation("common");
  const [select, setSelect] = React.useState(3);


  const [socketSymbol, setsocketSymbol] = React.useState("");


  const { dashboard, OpenBookBuy, OpenBooksell, marketTrades, currentPair } =
    useSelector((state: RootState) => state.exchange);
  const { settings } = useSelector((state: RootState) => state.common);



  //************************* SET THE FIRST TRADE IN THE DAY ************************** */
  const setCeroTradeToApi = async (dataToApi: Data, url: string) => {
    console.log('data to API: ', dataToApi);
    const dataFromApi = await fetchSetSGA(url, dataToApi);
    console.log('data Trade: ', dataFromApi.data);

    if(dataFromApi.status === true){
        localStorage.setItem('tradeList', JSON.stringify([dataFromApi.data]));
        setRowData(dataFromApi.data);
        let arrayOrder: Order[] = [];
        const newOrder: Order  = {
          id: 0,
          idTrade: dataFromApi.data.id,
          openprice: dataFromApi.data.OpenPrice,
          time: dataFromApi.data.time,
          symbol: dataFromApi.data.symbol,
          side: dataFromApi.data.side,
          quantity: dataFromApi.data.quantity,
          usuId: dataFromApi.data.usuId,
          type: 0,
          created_at: '',
          updated_at: ''
        }
        arrayOrder.push(newOrder);
        setOrderToApi(newOrder, 'https://desarrolloruralsrc.com/vCapitalOrders.php', arrayOrder);
        addOpenedTrade(dataFromApi.data);
    } else {
      alert('No se pudo guardar el trade');
    }
  }

  const setOrderToApi = async (dataToApi: Order, url: string, orderArray: Order[]) => {
    console.log('data to API: ', dataToApi, orderArray);
    const dataFromApi = await fetchSetOrderSGA(dataToApi);
    console.log('dataOrders: ', dataFromApi);

    if(dataFromApi.status === true){
      //orderArray.push(dataToApi);
      console.log('order push: ', orderArray);
      localStorage.setItem('ordersList', JSON.stringify(orderArray));
      setOrdersData(orderArray);
      disabledSellAndBuyButton(2);
    } else {
      alert('No se pudo guardar la orden');
      disabledSellAndBuyButton(2);
    }
  }

  //************************* SET THE NEXT TRADE IN THE DAY ************************** */
  const addTradeToApi = async (dataToApi: Data, url: string, tradeList: Data[], listOrders: Order[]) => {
    console.log('data to API: ', dataToApi);
    const dataFromApi = await fetchSetSGA(url, dataToApi);
    console.log('data Trade: ', dataFromApi);

    if(dataFromApi.status === true){
      tradeList.push(dataFromApi.data);
      console.log('tradeList push: ', tradeList);
      localStorage.setItem('tradeList', JSON.stringify(tradeList));
      setRowData(tradeList);
      
      const newOrder: Order  = {
        id: 0,
        created_at: '',
        updated_at: '',
        idTrade: dataFromApi.data.id,
        openprice: dataFromApi.data.OpenPrice,
        time: dataFromApi.data.time,
        symbol: dataFromApi.data.symbol,
        side: dataFromApi.data.side,
        quantity: dataFromApi.data.quantity,
        usuId: dataFromApi.data.usuId,
        type: 0
      }
      listOrders.push(newOrder);
      setOrderToApi(newOrder, 'https://desarrolloruralsrc.com/vCapitalOrders.php', listOrders);
      addOpenedTrade(dataFromApi.data);
    } else {
      alert('No se pudo guardar el trade');
    }
  }

  const updateTradeToApi = async (tradeList: Data[], listOrders: Order[], index: number, dataOrder: Data, typeUpdate: number) => {
    const dataFromApi = await fetchUpdateTrade(tradeList[index]);
    console.log('data Trade: ', dataFromApi);

    if(dataFromApi.status === true){
      localStorage.setItem('tradeList', JSON.stringify(tradeList));
      setRowData(tradeList);

      const newOrder: Order  = {
        id: 0,
        created_at: '',
        updated_at: '',
        idTrade: tradeList[index].id, //change to the real trade's id
        openprice: dataOrder.OpenPrice,
        time: dataOrder.time,
        symbol: dataOrder.symbol,
        side: dataOrder.side,
        quantity: dataOrder.quantity,
        usuId: dataOrder.usuId,
        type: 0
      }
      listOrders.push(newOrder);
      setOrderToApi(newOrder, 'https://desarrolloruralsrc.com/vCapitalOrders.php', listOrders);

      if(typeUpdate === 0) {
        editQuantity(tradeList[index]);
      } else if(typeUpdate === 1) {
        closeTradeByMarket(tradeList[index]);
      }

    } else {
      alert('No se pudo guardar el trade');
    }
  }
  const updateClosedTradeToApi = async (tradeList: Data[], listOrders: Order[], index: number, dataOrder: Data, typeUpdate: number) => {
    const newOrder: Order  = {
      id: 0,
      created_at: '',
      updated_at: '',
      idTrade: tradeList[index].id, //change to the real trade's id
      openprice: dataOrder.OpenPrice,
      time: dataOrder.time,
      symbol: dataOrder.symbol,
      side: dataOrder.side,
      quantity: dataOrder.quantity,
      usuId: dataOrder.usuId,
      type: 0
    }
    listOrders.push(newOrder);
    const netPl = setNetPL(tradeList[index], dataOrder.OpenPrice, listOrders);
    tradeList[index].netPL = netPl;

    const dataFromApi = await fetchUpdateTrade(tradeList[index]);
    console.log('data Trade: ', dataFromApi);

    if(dataFromApi.status === true){
      localStorage.setItem('tradeList', JSON.stringify(tradeList));
      setRowData(tradeList);

      setOrderToApi(newOrder, 'https://desarrolloruralsrc.com/vCapitalOrders.php', listOrders);

      if(typeUpdate === 0) {
        editQuantity(tradeList[index]);
      } else if(typeUpdate === 1) {
        closeTradeByMarket(tradeList[index]);
      }
      disabledSellAndBuyButton(2);

    } else {
      disabledSellAndBuyButton(2);
      alert('No se pudo guardar el trade');
    }
  }


  //*************** FUNCTION TO ADMIN THE NEW ORDER ********************** */
  const [isMarketButtonDisabled, setisMarketButtonDisabled] = useState(false);
  const [isButtonDisabledTest, setButtonDisabledTest] = useState(false);

  const disabledSellAndBuyButton = (option: number) => {
    const sellButton = document.getElementById('sellButton') as HTMLButtonElement;
    const buyButton = document.getElementById('buyButton') as HTMLButtonElement;
    if(option === 1 && sellButton && buyButton) {
      setButtonDisabledTest(true);
      // sellButton.disabled = true;
      // buyButton.disabled = true;
      sellButton.style.background = "#c87272";
      sellButton.style.cursor = "not-allowed";
      buyButton.style.background= "#7cb78e";
      buyButton.style.cursor = "not-allowed";
    } else if(option === 2 && sellButton && buyButton) {
      setButtonDisabledTest(false);
      // sellButton.disabled = false;
      // buyButton.disabled = false;
      sellButton.style.background = "#e21717";
      sellButton.style.cursor = "pointer";
      buyButton.style.background = "#0ab20a";
      buyButton.style.cursor = "pointer";
      if (sellButton && sellButton.disabled &&
        buyButton && buyButton.disabled) { 
          buyButton.disabled = false;
          sellButton.disabled = false;
      }
    }
  }
  const handleDataFromChild = (data: Data) => {
    if(newTradeConditions(data)) {return;}
    disabledSellAndBuyButton(1);
    console.log('data from child: ',data);
    setsocketSymbol(data.symbol);
    const openedTableRef = openedTradesRef.current;

    let listTrades = JSON.parse(localStorage.getItem('tradeList') || "[]")
    let listOrders = JSON.parse(localStorage.getItem('ordersList') || "[]")
    setRowData(listTrades);

    if(listTrades.length === 0) {
      console.log('storage en 0');
      setbuyPower(data.quantity*data.OpenPrice);
      console.log('buyPower into cero trades: ', buyPower);
      // const newTrade: Data[] = [data];
      const newTrade: Data[] = [];
      // const newOrder: Order  = {
      //   idTrade: 0,
      //   openprice: data.OpenPrice,
      //   time: data.time,
      //   symbol: data.symbol,
      //   side: data.side,
      //   quantity: data.quantity,
      //   type: 0
      // }
      // newTrade[0].id = 0;
      console.log('newTrade: ', newTrade);
      // console.log('newOrder: ', newOrder);
      // setOrdersData((prevData: Order[]) => [...prevData, newOrder]);
      // localStorage.setItem('tradeList', JSON.stringify(newTrade));
      // localStorage.setItem('ordersList', JSON.stringify([newOrder]));
      // setRowData(newTrade);
      // addOpenedTrade(data);

      // set a new order to the database
      // Set new trade to the database
      setCeroTradeToApi(data, 'https://desarrolloruralsrc.com/vCapitalTrades.php');
      // setOrderToApi(newOrder, 'https://desarrolloruralsrc.com/vCapitalOrders.php', [newOrder]);

      return;
    }

    const tradeFiltered = listTrades.findIndex((trade: Data) =>
      trade.symbol === data.symbol && trade.close === 0
    );
    console.log('trade filtered: ', tradeFiltered);

    if(tradeFiltered === -1){
      console.log('filtered -1');
      console.log('rowData: ', rowData);
      if(buyPowerConditions(data)) return;
      
      addTradeToApi(data, 'https://desarrolloruralsrc.com/vCapitalTrades.php', listTrades, listOrders);
      // Set new trade to the database
      // Get the new trade to the database

      // listTrades.push(data);
      // listTrades[listTrades.length-1].id = listTrades.length - 1; //get the new trade id by the api
      // console.log(listTrades);
      // localStorage.setItem('tradeList', JSON.stringify(listTrades));

      listTrades = JSON.parse(localStorage.getItem('tradeList') || "[]")
      
      // const newOrder: Order  = {
      //   idTrade: listTrades.id,
      //   openprice: data.OpenPrice,
      //   time: data.time,
      //   symbol: data.symbol,
      //   side: data.side,
      //   quantity: data.quantity,
      //   usuId: data.usuId,
      //   type: 0
      // }

      // Set the new order to the database
      // listOrders.push(newOrder);
      // localStorage.setItem('ordersList', JSON.stringify(listOrders));
      // marketSocket.emit("subscribe", data.symbol);
      // setRowData(listTrades);
      // console.log('rowData: ', rowData);
      // addOpenedTrade(data);

    } else {
      console.log('index filtered different', tradeFiltered);

      // const newOrder: Order  = {
      //   idTrade: listTrades[tradeFiltered].id, //change to the real trade's id
      //   openprice: data.OpenPrice,
      //   time: data.time,
      //   symbol: data.symbol,
      //   side: data.side,
      //   quantity: data.quantity,
      //   usuId: data.usuId,
      //   type: 0
      // }
      // // ***************** Set the new order to the database *************
      // listOrders.push(newOrder);
      // localStorage.setItem('ordersList', JSON.stringify(listOrders));

      if(listTrades[tradeFiltered].side === data.side) {
        if(buyPowerConditions(data)) return;
        listTrades[tradeFiltered].quantity = listTrades[tradeFiltered].quantity + data.quantity;
        if(listTrades[tradeFiltered].quantity > 500) {
          disabledSellAndBuyButton(2);
          showAlertToast('La suma total de lotes en el trade excede la cantidad maxima de 5 Lotes');
          return;
        }
        updateTradeToApi(listTrades, listOrders, tradeFiltered, data, 0);

        // localStorage.setItem('tradeList', JSON.stringify(listTrades));
        // setRowData(listTrades);
        // editQuantity(listTrades[tradeFiltered]);
      } else {
        const tempLastTrade = listTrades[tradeFiltered];
        listTrades[tradeFiltered].quantity = listTrades[tradeFiltered].quantity - data.quantity;
        if(listTrades[tradeFiltered].quantity < 0) {
          disabledSellAndBuyButton(2);
          showAlertToast('El número de lotes en la orden excede el número de lotes en la posición del trade');
          return;
          let tempOrder = listTrades[tradeFiltered]; // logic to know if new trade is correct with the buypower
          let tempBuyPower = buyPower - tempLastTrade.quantity*tempLastTrade.OpenPrice;
          tempOrder.OpenPrice = data.OpenPrice;
          tempOrder.quantity = data.quantity*(-1);
          if(tempOrder.OpenPrice*tempOrder.quantity + tempBuyPower < 50.000){
            tempBuyPower = tempBuyPower + tempOrder.OpenPrice*tempOrder.quantity;
            // buyPower = tempBuyPower;
            setbuyPower(tempBuyPower);
          } else {
            showAlertToast('El costo de la orden excede el poder de compra');
            return;
          }
          listTrades[tradeFiltered].side = listTrades[tradeFiltered].side === 1 ? 0 : 1;
          listTrades[tradeFiltered].quantity = listTrades[tradeFiltered].quantity * (-1);

          updateTradeToApi(listTrades, listOrders, tradeFiltered, data, 0);
          // editQuantity(listTrades[tradeFiltered]);
        } else if(listTrades[tradeFiltered].quantity === 0) {
          setbuyPower(buyPower - data.OpenPrice * data.quantity); // It's not necessary now, reduce or diminish purchasing power
          setBuyPowerStorage(data.OpenPrice, data.quantity);
          listTrades[tradeFiltered].close = 1; //identifica al trade como cerrado
          
          //updateTradeToApi(listTrades, listOrders, tradeFiltered, data, 1);
          updateClosedTradeToApi(listTrades, listOrders, tradeFiltered, data, 1);
          unSubscribeSymbol(listTrades[tradeFiltered].symbol);
          updateBalanceToApi(listTrades[tradeFiltered].netPL);
          // closeTradeByMarket(listTrades[tradeFiltered]);
        } else {
          setbuyPower(buyPower - data.OpenPrice * data.quantity); // It's not necessary now, reduce or diminish purchasing power
          setBuyPowerStorage(data.OpenPrice, data.quantity);
          updateTradeToApi(listTrades, listOrders, tradeFiltered, data, 0);
        }
        // ********* Update the trade into the database with the new data of listTrades[tradeFiltered] ********
        // localStorage.setItem('tradeList', JSON.stringify(listTrades));
        // setRowData(listTrades);
      }
    }
  };


  /******************** SECCION OF MODAL STOP AND PROFIT ***************** */

  const [isOpen, setIsOpen] = useState(false);
  const [stopProfitID, setstopProfitID] = useState(0);
  
  const adminStopProfit = (id: number) => {
    console.log('id del boton: ', id);
    setIsOpen(true);
    setstopProfitID(id);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  
  const handleModalSubmit = (dataFromModal: stopProfit) => {
    console.log('data from modal: ',dataFromModal);
    let onListTrades: Data[] = JSON.parse(localStorage.getItem('tradeList') || "[]")

    const tradeIndex = onListTrades.findIndex((trade: Data) => trade.id === stopProfitID);

    const priceString: string = document.getElementById(`td-${onListTrades[tradeIndex].symbol}-currentPrice-id`)?.textContent || '';
    const currentPrice: number = priceString === '' ? 0 : parseFloat(priceString);
    const orderPrice: number = dataFromModal.price;
    console.log('orderPrice: ', orderPrice, 'current price: ', currentPrice);
    if(currentPrice === 0) return;

    if (dataFromModal.type == 'profit') {
      if(onListTrades[tradeIndex].side === 1) {
        if(currentPrice < dataFromModal.price && dataFromModal.price < onListTrades[tradeIndex].OpenPrice*2) {
          onListTrades[tradeIndex].profit = dataFromModal.price;
        } else {
          alert('El precio de la orden no está dentro de los limites de intraday');
          return;
        }
      } else {
        if(currentPrice > dataFromModal.price && dataFromModal.price > 0) {
          onListTrades[tradeIndex].profit = dataFromModal.price;
        } else {
          alert('El precio de la orden no está dentro de los limites de intraday');
          return;
        }
      }
    };
    if (dataFromModal.type == 'stop') {
      if(onListTrades[tradeIndex].side === 0) {
        if( currentPrice < dataFromModal.price && dataFromModal.price < onListTrades[tradeIndex].OpenPrice*2) {

          onListTrades[tradeIndex].stop = dataFromModal.price;
        } else {
          alert('El precio de la orden no está dentro de los limites de intraday');
          return
        }
      } else {
        if( currentPrice > dataFromModal.price && dataFromModal.price > 0) {
              
          onListTrades[tradeIndex].stop = dataFromModal.price
        } else {
          alert('El precio de la orden no está dentro de los limites de intraday');
          return;
        }
      } 
    };
    
    //update the trade into the database 
    updateCloseOrProfit(onListTrades, tradeIndex, dataFromModal);
    // localStorage.setItem('tradeList', JSON.stringify(onListTrades));
    // setRowData(onListTrades);
    // editProfitStopCell(dataFromModal, onListTrades[stopProfitID].symbol);
  };

  
  const updateCloseOrProfit = async (onListTrades: Data[], idTrade: number, dataFromModal: stopProfit) => {
    const dataFromApi = await fetchUpdateTrade(onListTrades[idTrade]);
    console.log('profit or stop order: ', dataFromApi);

    if(dataFromApi.status === true){
      console.log(dataFromApi.mensaje);
      localStorage.setItem('tradeList', JSON.stringify(onListTrades));
      setRowData(onListTrades);
      editProfitStopCell(dataFromModal, onListTrades[idTrade].symbol);
    } else {
      alert('No se pudo actualizar el trade');
    }
  }
  const updateBalanceToApi = async (netPL: number) => {
    let balance = JSON.parse(localStorage.getItem('balance') || "");
    const NewBalance = parseFloat(balance.balance) + netPL;
    const response = await updateBalance(NewBalance, balance.id);
    console.log('RESPONSE UPDATED BALANCE', response);
    if(response.status) localStorage.setItem('balance', JSON.stringify(response.data));
  }
  
  return (
    <>
      <div className="col-xl-3" style={{display: "none"}}>
        <div className="trades-section" style={{height: "500px"}}>
          <div>
            <h6 className="text-white">{t("Order Book")}</h6>
          </div>
          <div className="trades-headers mb-3">
            <div className="orderBookIcons">
              <h3
                onClick={() => {
                  setSelect(2);
                }}
                className="icon-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="css-3kwgah w-25">
                  <path d="M4 4h7v16H4V4z" fill="#0ECB81"></path>
                  <path
                    d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                    fill="currentColor"></path>
                </svg>
              </h3>
              <h3
                onClick={() => {
                  setSelect(1);
                }}
                className="icon-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="css-3kwgah  w-25">
                  <path d="M4 4h7v16H4V4z" fill="#F6465D"></path>
                  <path
                    d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                    fill="currentColor"></path>
                </svg>
              </h3>
              <h3
                onClick={() => {
                  setSelect(3);
                }}
                className="icon-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="css-3kwgah w-25">
                  <path d="M4 4h7v7H4V4z" fill="#F6465D"></path>
                  <path d="M4 13h7v7H4v-7z" fill="#0ECB81"></path>
                  <path
                    d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                    fill="currentColor"></path>
                </svg>
              </h3>
            </div>
          </div>
          {select === 1 && (
            <>
              <AllSellOrdersFull OpenBooksell={OpenBooksell} />
            </>
          )}
        </div>
      </div>
      
      <div className="col-xl-9" style={{marginTop: "50px"}}>
        <div className="cp-user-buy-coin-content-area">
          <div className="card cp-user-custom-card">
            {currentPair && (
              <TradingChart
                //  @ts-ignore
                coinpair={dashboard?.order_data?.exchange_coin_pair}
              />
            )}
          </div>
        </div>
        <div id="openedTrades-table-id"></div>
      </div>
      <div className="col-xl-3" style={{marginTop: "50px"}}>
        <ExchangeBoxJs onData={handleDataFromChild} isButtonDisabled={isButtonDisabledTest}/>
      </div>
      <div style={{width: "100%", display: "flex"}}>
        <div style={{padding: "5px", width: "50%"}}>
          <div style={{marginTop: "20px", color: "white", border: "1px solid #434343"}}>
            <div style={{padding: "20px"}}>
              <p style={{fontSize: "initial"}}>Posiciones abiertas</p>
            </div>
            <div className="table-responsive">
              <div>
                <table ref={openedTradesRef} id="list-opened-trades-id" className="table">
                  <thead style={{fontSize: "13px"}}>
                    <tr>
                      <th scope="col">Simbolo</th>
                      <th scope="col">Side</th>
                      <th scope="col">Lotaje</th>
                      <th scope="col">Precio entrada</th>
                      <th scope="col">Precio actual</th>
                      <th scope="col">Precio Stop</th>
                      <th scope="col">Precio Profit</th>
                      <th scope="col">Net P/L</th>
                      <th scope="col">Plus</th>
                    </tr>
                  </thead>
                  <tbody style={{fontSize: "11px"}}>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding: "5px", width: "50%"}}>
          <div style={{marginTop: "20px", color: "white", border: "1px solid #434343"}}>
            <div style={{padding: "20px"}}>
              <p style={{fontSize: "initial"}}>Posiciones cerrados</p>
            </div>
            <div className="table-responsive">
              <table ref={closedTradesRef} id="list-closed-trades-id" className="table">
                <thead style={{fontSize: "13px"}}>
                  <tr>
                    <th scope="col">Simbolo</th>
                    <th scope="col">Side</th>
                    <th scope="col">Lotaje</th>
                    <th scope="col">Precio entrada</th>
                    <th scope="col">Precio Stop</th>
                    <th scope="col">Precio Profit</th>
                    <th scope="col">Net P/L</th>
                  </tr>
                </thead>
                <tbody style={{fontSize: "11px"}}>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* {parseInt(settings?.exchange_layout_view) === EXCHANGE_LAYOUT_ONE && (
        <OrderHistorySection bottom={true}/>
      )} */}
      <div>
        <Modal isOpen={isOpen} onClose={closeModal} onSubmit={handleModalSubmit}>
          <h2>Contenido del Modal</h2>
          <p>Este es el contenido del modal.</p>
        </Modal>
      </div>

    </>
  );
};

export default DashboardBody;
