var channelToSubscription = new Map();

var token = ''
var socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

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

export function subscribeOnStream(
    symbolInfo, resolution, onRealtimeCallback, subscriberUID,
    onResetCacheNeededCallback, lastBar) 
{
    console.log('subscribe ifunction');

    const channelString = `${symbolInfo.exchange}~${symbolInfo.name}`;
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

	/************************** CONNECT TO THE WEBSOCKET *************************** */
	const token = ''
	const socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);
    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
        console.log('onconnected');
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': `${symbolInfo.name}`}))
    });
    // Listen for messages
    socket.addEventListener('message', function (event) {
	console.log(event.data);
	const data = JSON.parse(event.data);
	const eventTypeStr = data.type;
	if (eventTypeStr !== 'trade') {
            // Skip all non-trading events
            return;
        }
        const tradePriceStr = data.data[length-1].p;
        const tradeTimeStr = data.data[length-1].t/1000;
        const tradePrice = parseFloat(tradePriceStr);
        const tradeTime = parseInt(tradeTimeStr);
        const subscriptionItem = channelToSubscription.get(channelString);
		if (subscriptionItem === undefined) {
            return;
        }
        const lastBar = subscriptionItem.lastBar;
        const nextBar = getNextBarTime(lastBar, tradeTime, resolution, tradePrice);

        subscriptionItem.lastBar = nextBar;
        // Send data to every subscriber of that symbol
        subscriptionItem.handlers.forEach(handler => handler.callback(nextBar));
    });

}

export function unsubscribeFromStream(subscriberUID) {
    console.log('[unsubscribeBars]: Unsubscribe from streaming:', subscriberUID);
	for (const channelString of channelToSubscription.keys()) {
        const subscriptionItem = channelToSubscription.get(channelString);
        const handlerIndex = subscriptionItem.handlers
            .findIndex(handler => handler.id === subscriberUID);

		if (handlerIndex !== -1) {
			// Remove from handlers
			subscriptionItem.handlers.splice(handlerIndex, 1);
			if (subscriptionItem.handlers.length === 0) {
				// Unsubscribe from the channel if it is the last handler
                const channelArray = channelString.split("~");
				socket.send(JSON.stringify({'type':'unsubscribe','symbol': `${channelArray[1]}`}));
				channelToSubscription.delete(channelString);
				break;
			}
		}
    }
}
