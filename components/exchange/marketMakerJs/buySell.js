import axios from 'axios';

async function postData(url, data) {
    try {
      const response = await axios.post(url, data);
      console.log('Datos guardados correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      return 'error';
    }
}

export function buyMarket() {
  const time = new Date();
  const timeString = time.toString();
    const data = {
      id: 0,
      OpenPrice: parseFloat(document.getElementById('market-maker-input-price-id').value),
      quantity: parseInt(document.getElementById('market-maker-input-quantity-id').value),
      side: 1, //1 for LONG side
      symbol: document.getElementById('symbol-stock-us-id').value,
      close: 0, //0 for open trade
      usuId: parseFloat(localStorage.getItem('user_id')), //usu id, waiting for Manuel to tell me how i can obtain this data
      netPL: 0,
      currentPrice: 0,
      stop: 0,
      profit: 0,
      time: timeString,  
      created_at: '',
      updated_at: ''
    }

    return data;
}

export function sellMarket() {
  const time = new Date();
  const timeString = time.toString();
    const data = {
      id: 0,
      OpenPrice: parseFloat(document.getElementById('market-maker-input-price-id').value),
      quantity: parseInt(document.getElementById('market-maker-input-quantity-id').value),
      side: 0, //0 for SHORT side
      symbol: document.getElementById('symbol-stock-us-id').value,
      close: 0, //0 for open trade
      usuId: parseFloat(localStorage.getItem('user_id')), //usu id, waiting for Manuel to tell me how i can obtain this data
      time: timeString,
      netPL: 0,
      currentPrice: 0,
      stop: 0,
      profit: 0,  
      created_at: '',
      updated_at: ''
    }

    return data;
}

export const setLocalStorageItem = (key, value) => {
    console.log('value: ', value);
    // localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
};

export const getLocalStorageItem = (key) => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
};

export const setBuyPowerFunction = (price, quantity) => {
  let buyPowerStorage = parseFloat(localStorage.getItem('buyPower') || "0");
    console.log('INTO SETBUYPOWER FUNCTION', price, quantity);
  buyPowerStorage = buyPowerStorage - price*quantity;
    console.log('INTO SETBUYPOWER FUNCTION AFTER MINUS', buyPowerStorage.toFixed(2));
  localStorage.setItem('buyPower', buyPowerStorage.toFixed(2).toString());
};
