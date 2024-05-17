import { parseCookies } from 'nookies';
var url = 'http://dashboard.vcapitaltraders.com/api/traders';

export async function fetchData() {
    console.log('Hi from api file');
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    const data = await response.json()
    console.log(data);
}

// export async function testApi() {
//     try {
//         const response = await fetch('http://dashboard.vcapitaltraders.com/api/traders', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json; charset=UTF-8',
//             },
//         });
//         return response.json();
//     } catch(error) {
//         throw new Error(`test api request error: ${error.status}`);
//     }
// }

// export async function fetchTrades() {
//     try {
//         const response = await fetch('http://dashboard.vcapitaltraders.com/api/traders', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json; charset=UTF-8',
//             },
//         });
//         return response.json();
//     } catch(error) {
//         throw new Error(`test api request error: ${error.status}`);
//     }
// }

// export async function getTrades() {
//     fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         localStorage.setItem('tradeList', JSON.stringify(data));
//         localStorage.setItem('ordersList', JSON.stringify(newOrder));
//         return data;
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

export async function fetchDataSGA() {
    console.log('Hi from api file');
    const cookies = parseCookies();
    const token = cookies.token;
    const usuId = parseInt(localStorage.getItem('user_id'));

    // Obtener la fecha y hora actual
    const now = new Date();

    // Obtener los componentes de la fecha y hora
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Crear la cadena de fecha y hora en el formato deseado
    const currentDateTimeString = `${year}-${month}-${day}`;

    const response = await fetch(`https://dashboard.vcapitaltraders.com/api/traders?usuId=${usuId}&fecha=${currentDateTimeString}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}

export async function fetchOrderSGA() {
    console.log('Hi from api file');
    const cookies = parseCookies();
    const token = cookies.token;
    const usuId = parseInt(localStorage.getItem('user_id'));

    // Obtener la fecha y hora actual
    const now = new Date();

    // Obtener los componentes de la fecha y hora
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Crear la cadena de fecha y hora en el formato deseado
    const currentDateTimeString = `${year}-${month}-${day}`;

    const response = await fetch(`https://dashboard.vcapitaltraders.com/api/orders?usuId=${usuId}&fecha=${currentDateTimeString}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}

export async function fetchSetSGA(url, data) {
    console.log('Hi from api file: ', url);
    const cookies = parseCookies();
    const token = cookies.token;

    // Obtener la fecha y hora actual
    const now = new Date();

    // Obtener los componentes de la fecha y hora
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Crear la cadena de fecha y hora en el formato deseado
    const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const formatData = {
        OpenPrice: data.OpenPrice,
        close: data.close,
        netPL: data.netPL,
        profit: data.profit,
        quantity: data.quantity,
        side: data.side,
        stop: data.stop,
        symbol: data.symbol,
        usuId: data.usuId,
        time: currentDateTimeString
    }
    console.log('Console data to api: ',JSON.stringify(formatData));
    const response = await fetch('https://dashboard.vcapitaltraders.com/api/traders', {
        method: 'POST',
        body: JSON.stringify(formatData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}

export async function fetchSetOrderSGA(orderData) {
    console.log('Hi from api file TEst api Manuel noche: ', JSON.stringify(orderData));
    const cookies = parseCookies();
    const token = cookies.token;

    // Obtener la fecha y hora actual
    const now = new Date();

    // Obtener los componentes de la fecha y hora
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Crear la cadena de fecha y hora en el formato deseado
    const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    //orderData.time = currentDateTimeString;

    const order = {
        idTrade: orderData.idTrade,
        openprice: orderData.openprice,
        time: currentDateTimeString,
        symbol: orderData.symbol,
        side: orderData.side,
        quantity: orderData.quantity,
        type: orderData.type,
        usuId: orderData.usuId
    }
    const response = await fetch('https://dashboard.vcapitaltraders.com/api/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}

export async function fetchUpdateTrade(data) {
    console.log('Hi from api file');
    const cookies = parseCookies();
    const token = cookies.token;

    // Obtener la fecha y hora actual
    const now = new Date();

    // Obtener los componentes de la fecha y hora
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Crear la cadena de fecha y hora en el formato deseado
    const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const formatData = {
        OpenPrice: data.OpenPrice,
        close: data.close,
        netPL: data.netPL,
        profit: data.profit,
        quantity: data.quantity,
        side: data.side,
        stop: data.stop,
        symbol: data.symbol,
        usuId: data.usuId,
        time: currentDateTimeString
    }
    const response = await fetch(`https://dashboard.vcapitaltraders.com/api/traders/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(formatData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}

export async function fetchCloseTrade(closeTrade) {
    console.log('Hi from api file', closeTrade);
    const cookies = parseCookies();
    const token = cookies.token;
    const body = {
        quantity: closeTrade.quantity,
        side: closeTrade.side,
        symbol: closeTrade.symbol,
        close: closeTrade.close,
        usuId: closeTrade.usuId,
        netPL: closeTrade.netPL,
        stop: closeTrade.stop,
        profit: closeTrade.profit,
        orderOpenPrice: closeTrade.orderOpenprice,
        orderSide: closeTrade.orderSide,
        orderQuantity: closeTrade.orderQuantity,
        orderType: closeTrade.orderType
    }
    const response = await fetch(`https://dashboard.vcapitaltraders.com/api/editar-trade/${closeTrade.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}
