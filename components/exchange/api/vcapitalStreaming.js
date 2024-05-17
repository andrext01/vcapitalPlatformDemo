import {onTradeTracking, setNetPL} from "../marketMakerJs/stopProfitMarket";
import {fetchCloseTrade} from "../marketApi/marketApi";
import {showNetPLAndCurrentPrice, showBalance} from "../marketMakerJs/watchTrades";
import {updateBalance} from '../marketApi/balanceApi';
import {setBuyPowerFunction} from '../marketMakerJs/buySell';

let io = require(`socket.io-client`);

export const socket = io(`https://finnhub-websocket-dea5a4d752cf.herokuapp.com`, { transports: ['websocket'] });

socket.on()
// Connection opened -> Subscribe
socket.on("connect", () => {
	console.log(socket.id);
	if(globalSymbol != '') socket.emit("subscribe", globalSymbol);
});
// either by directly modifying the `auth` attribute
socket.on("connect_error", () => {
	console.log('tratando de conectar con socket');
	socket.connect();
	socket.emit("subscribe", globalSymbol);
});

// Listen for messages
socket.on("message", (message) => {
	if(!message) return;
	if(message === 'Conectado') return;
	// console.log('message to chart: ', message, socket.id);
	const data = JSON.parse(message);
    	if(!data.c || data.c.length === 0) return;
    	const cValues = data.c;
    
    	const containsForbiddenValue = cValues.some(value => forbiddenValues.includes(value));
    	if (containsForbiddenValue) return; // Get out from function if "c" don't contains update last data
	
	// console.log('message to chart: ', message, socket.id);
    	trackingOpenedTrades(data);
	if(data.s !== globalSymbol) return;
	const tradePriceStr = data.p;
	const tradeTimeStr = data.t/1000;
	const tradePrice = parseFloat(tradePriceStr);
	const tradeTime = parseInt(tradeTimeStr);
	// put price into the input price in the marketmaker
	const inputElement = document.getElementById('market-maker-input-price-id');
	const symbolElement = document.getElementById('symbol-stock-us-id');
	const channelString = data.s;
	if (inputElement && data.s === symbolElement.value) {
	    inputElement.value = tradePrice;
	}
	const subscriptionItem = channelToSubscription.get(channelString);
	if (subscriptionItem === undefined) {
	    return;
	}
	const lastBar = subscriptionItem.lastBar;
	const nextBar = getNextBarTime(lastBar, tradeTime, globalResolution, tradePrice);
	
	subscriptionItem.lastBar = nextBar;
	// Send data to every subscriber of that symbol
	subscriptionItem.handlers.forEach(handler => handler.callback(nextBar));
});


var forbiddenValues = [ "3", "5", "9", "10", "11", "12", "15", "16", "17", "18", 
                        "20", "21", "22", "24", "25", "26", "27", "30", "31", "32",
                        "34", "36", "37", "38", "40", "41"];
var channelToSubscription = new Map();
var globalResolution = '';
var globalSymbol = '';

function trackingOpenedTrades(dataMessage) {
    // console.log("MarketClient message: ", dataMessage); // message send from server
    const symbolEvent = dataMessage;
    const storageTrades = JSON.parse(localStorage.getItem('tradeList') || "[]");
    const storageOrders = JSON.parse(localStorage.getItem('ordersList') || "[]");
    let balance = JSON.parse(localStorage.getItem('balance') || "{}");
    let validateClose = true;
    let totalPL = 0;
    //const storageTrades = rowData;
    //console.log('storageTrades: ', storageTrades);
    if(storageTrades.length == 0) return;
    // (symbolEvent.s === globalSymbol) ? validateClose = false : null;

    for(let i=0; i<storageTrades.length; i++) {
        const trade = storageTrades[i];
	
        if(trade.symbol === symbolEvent.s && trade.close === 0) {
          const netPl = setNetPL(trade, symbolEvent.p, storageOrders);
          const netPlFixed = parseFloat(netPl.toFixed(2));
          storageTrades[i].netPL = netPlFixed;
        //   document.getElementById(`td-${trade.symbol}-netPL-id`).textContent = netPl.toString();

          storageTrades[i].currentPrice = parseFloat(symbolEvent.p);
        //   document.getElementById(`td-${symbolEvent.s}-currentPrice-id`).textContent = storageTrades[i].currentPrice;
            showNetPLAndCurrentPrice(storageTrades[i]);
          const tracking = onTradeTracking(trade.side, trade.stop, trade.profit, symbolEvent.p);
          if (tracking.typeOrder !== 0) {
	    const quant = storageTrades[i].quantity;
	    if(globalSymbol !== trade.symbol) socket.emit("unsubscribe", trade.symbol);
            putClosedTrade(tracking, trade, symbolEvent.p, quant);
            storageTrades[i].close = 1;
            storageTrades[i].quantity = 0;
            closeIntoBalance(netPlFixed, parseFloat(balance.balance), balance.id);
          } else {
                // totalPL += storageTrades[i].netPL; // setting the daily net_PL
            }
                totalPL += storageTrades[i].netPL; // setting the daily net_PL
        }
    }
    // validateClose ? socket.emit("unsubscribe", symbolEvent.s) : null;
    // ********* Update the trade into the database with the new data of listTrades[tradeFiltered] ********
    localStorage.setItem('tradeList', JSON.stringify(storageTrades));
    showBalance(totalPL, parseFloat(balance.balance));
}

const closeIntoBalance = async (netPlFixed, balance, id) => {
    const NewBalance = balance + netPlFixed;
    const response = await updateBalance(NewBalance, id);
    console.log('RESPONSE UPDATED BALANCE', response);
    if(response.status) localStorage.setItem('balance', JSON.stringify(response.data));
}

const putClosedTrade = async (tracking, trade, price, quant) => {
	console.log('TEST OF QUANTITY',trade);
	console.log('TEST OF QUANTITY INTO OTHER VAR',quant);
    const newOrder = {
        idTrade: trade.id,
        openprice: price,
        time: new Date(),
        symbol: trade.symbol,
        side: tracking.side,
        quantity: trade.quantity,
        type: tracking.typeOrder
    }
    const listOrders = JSON.parse(localStorage.getItem('ordersList') || "[]")
    const netPl = setNetPL(trade, price, listOrders);
    const netPlFixed = parseFloat(netPl.toFixed(2));
    listOrders.push(newOrder);
    const closeTrade = {
        id: trade.id,
        orderOpenprice: price,
        symbol: trade.symbol,
        orderSide: tracking.side,
        orderQuantity: trade.quantity,
        orderType: tracking.typeOrder, 
        usuId: trade.usuId, 
        quantity: 0, 
        side: trade.side, 
        close: 1, 
        netPL: netPlFixed, 
        stop: trade.stop, 
        profit: trade.profit
    }
    const datafromApi = await fetchCloseTrade(closeTrade);
    console.log('dataOrders: ', datafromApi);
    if(datafromApi.status){
        localStorage.setItem('ordersList', JSON.stringify(listOrders));
        updateWatchOrders(trade);
	console.log('CLOSE INTO STREAM', price, trade.quantity);
        setBuyPowerFunction(price, quant);
    } else {
        console.log('order and trade couldnt be sent');
    }
}

function updateWatchOrders(trade) {
    const rowToRemove = document.getElementById(`opened-row-${trade.symbol}-id`);
    if (rowToRemove) { rowToRemove.remove(); }  //confirm either row exist

    const tbody = document.getElementById('list-closed-trades-id').getElementsByTagName('tbody')[0];

    // Crea una nueva fila en el tbody
    const newRow = tbody.insertRow();

    // Datos para las celdas de la fila
    const Tradedata = [trade.symbol, trade.side, trade.quantity, trade.OpenPrice, trade.stop, trade.profit, trade.netPL];
    Tradedata[1] = trade.side === 1 ? 'LONG': 'SHORT';
    // Itera sobre los datos y agrega las celdas a la fila
    Tradedata.forEach((data, index) => {
        const newCell = newRow.insertCell();
        newCell.textContent = data;
    });
    const profitCell = newRow.cells[6];
    const sideCell = newRow.cells[1];
    
    profitCell.style.color = Tradedata[6] >= 0 ? '#1DEE00': '#FF0000';
    sideCell.style.color = Tradedata[1] === 'LONG' ? '#1DEE00': '#FF0000';
	
    // Itera sobre los datos y agrega las celdas a la fila
    // Tradedata.forEach((data, index) => {
    //     const newCell = newRow.insertCell();
    //     newCell.textContent = data;
    // });
}

function getNextBarTime(lastBar, dateTime, chartResolution, price) {
    let resolution;
    if (parseInt(chartResolution) == 1) { resolution = 1;}
    else if(parseInt(chartResolution) == 2) { resolution = 2;}
    else if(parseInt(chartResolution) == 5) { resolution = 5;}
    else if(parseInt(chartResolution) == 15) { resolution = 15;}
    else if(chartResolution.includes('D')) { resolution = 1440;}
    else if(chartResolution.includes('W')) { resolution = 10080;}

    let coeff = resolution * 60;
    var rounded = Math.floor(dateTime / coeff) * coeff;
    var lastBarSec = lastBar.time / 1000;
    var _lastBar;
    if (rounded > lastBarSec) {
        // create a new candle, use last close as open **PERSONAL CHOICE**
        _lastBar = {
         time: rounded * 1000,
         open: lastBar.close,
         high: lastBar.close,
         low: lastBar.close,
         close: price
        }    
    } else {
        // update lastBar candle!
        if (price < lastBar.low) {
         lastBar.low = price
        } else if (price > lastBar.high) {
         lastBar.high = price
        }
        
        lastBar.close = price
        _lastBar = lastBar
    }
    return _lastBar
}

export function unSubscribeSymbol(symbol) {
	console.log('SYMBOL FROM DASHBOARD BODY', symbol);
	if(symbol !== globalSymbol) socket.emit("unsubscribe", symbol);
}

export function subscribeOnStream(
    symbolInfo, resolution, onRealtimeCallback, subscriberUID,
    onResetCacheNeededCallback, lastBar, test) 
{
    console.log('subscribe ifunction');

    globalResolution = resolution;
    globalSymbol = symbolInfo.name;
    const symbolElement = document.getElementById('symbol-stock-us-id');
    const priceElement = document.getElementById('market-maker-input-price-id');
    const channelString = symbolInfo.name;
    const handler = {
        id: subscriberUID,
        callback: onRealtimeCallback,
    };
    let subscriptionItem = channelToSubscription.get(channelString);
	if (subscriptionItem) { // Already subscribed to the channel, use the existing subscription
        subscriptionItem.handlers.push(handler);
        return;
    }
    subscriptionItem = {
        subscriberUID,
        resolution,
        lastBar,
        handlers: [handler],
    };
    channelToSubscription.set(channelString, subscriptionItem);
	
    console.log('socket obj', socket, symbolInfo.name);
    socket.emit("subscribe", symbolInfo.name);
    symbolElement.value = symbolElement ? symbolInfo.name : null;
    priceElement.value = null;
}

export function unsubscribeFromStream(subscriberUID) {
    	console.log('[unsubscribeBars]: Unsubscribe from streaming:', subscriberUID);
	const storageTrades = JSON.parse(localStorage.getItem('tradeList') || "[]");
	let validateClose = false;
        
	for (const channelString of channelToSubscription.keys()) {
		const subscriptionItem = channelToSubscription.get(channelString);
		const handlerIndex = subscriptionItem.handlers
		    .findIndex(handler => handler.id === subscriberUID);
		if (handlerIndex !== -1) {
			// Remove from handlers
			subscriptionItem.handlers.splice(handlerIndex, 1);
			if (subscriptionItem.handlers.length === 0) {
				// Unsubscribe from the channel if it is the last handler
				console.log('channelString: ', channelString);
				console.log('socketid: ', socket.id);
				channelToSubscription.delete(channelString);
				
				if(storageTrades.length !== 0) {
				        for(let i=0; i<storageTrades.length; i++) {
						(storageTrades[i].symbol === channelString && storageTrades[i].close === 0) ? validateClose = true : null;
					}	
				} else {
					validateClose = true;
				};
				if(!validateClose) socket.emit("unsubscribe", channelString);
				break;
			}
		}
    	}
}
