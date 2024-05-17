import { parseCookies } from 'nookies';
var url = 'http://dashboard.vcapitaltraders.com/api/traders';

export async function getBalance() {
    console.log('Hi from api file BALANCE');
    const cookies = parseCookies();
    const token = cookies.token;
    const usuId = parseInt(localStorage.getItem('user_id'));
    const response = await fetch(`https://dashboard.vcapitaltraders.com/api/walletFiat?user_id=${usuId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}

export async function updateBalance(NewBalance, id) {
    const cookies = parseCookies();
    const token = cookies.token;
    const usuId = parseInt(localStorage.getItem('user_id'));

    const formatData = {
        id: id,
        balance: NewBalance
    }
    console.log('Console data to api: ',JSON.stringify(formatData));

    const response = await fetch('https://dashboard.vcapitaltraders.com/api/updateWallet', {
        method: 'POST',
        body: JSON.stringify(formatData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
}
