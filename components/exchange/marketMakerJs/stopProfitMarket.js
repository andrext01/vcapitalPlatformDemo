export function onTradeTracking(side, stop, profit, currentPrice) {
    let result = {
        typeBlock: '',
        typeOrder: 0,
        side: 0
    };
    if(side === 1) {
        result = longTrade(stop, profit, currentPrice);
        if(result.typeOrder !== 0) { return result;}
    };
    if(side === 0) {
        result = shortTrade(stop, profit, currentPrice);
        if(result.typeOrder !== 0) { return result;}
    };
    return result;
}


function longTrade(stop, profit, currentPrice) {
    let result = {
        typeBlock: '',
        typeOrder: 0,
        side: 0
    };
    if(stop !== 0) {
        if(currentPrice <= stop) {
            result = {typeBlock: 'L', typeOrder: 1, side: 0};
            return result;
        }
    }
    if(profit !== 0) {
        if(currentPrice >= profit) {
            result = {typeBlock: 'L', typeOrder: 2, side: 0};
            return result;
        }
    }
    return result;
}

function shortTrade(stop, profit, currentPrice) {
    let result = {
        typeBlock: '',
        typeOrder: 0,
        side: 0
    };
    if(stop !== 0) {
        if(currentPrice >= stop) {
            result = {typeBlock: 'S', typeOrder: 1, side: 1};
            return result;
        }
    }
    if(profit !== 0) {
        if(currentPrice <= profit) {
            result = {typeBlock: 'S', typeOrder: 2, side: 1};
            return result;
        }
    }
    return result;
}

export function setNetPL(trade, currentPrice, storageOrders) {
    console.log("trade: ", trade);
    console.log("currentPrice: ", currentPrice);
    console.log("storageOrders: ", storageOrders);
    let buyCost = 0.00;
    let sellCost = 0.00;

    if(trade.side === 0) {
        buyCost = trade.quantity * currentPrice;
        console.log("buyCost: ", buyCost);
    } else if(trade.side === 1) {
        sellCost = trade.quantity * currentPrice;
        console.log("sellCost: ", sellCost);
    }

    for (const order of storageOrders) {
        if(trade.id === order.idTrade) {
            if(order.side === 0) {
                sellCost += order.openprice * order.quantity;
            } else if(order.side === 1) {
                buyCost += order.openprice * order.quantity;
                console.error("order.openprice: ", order.openprice);
                console.error("order.quantity: ", order.quantity);
            }
        }
    }
    console.log("sellCost: ", sellCost);
    console.log("buyCost: ", buyCost);

    return sellCost - buyCost;
}
