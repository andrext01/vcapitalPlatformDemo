import { parseCookies } from 'nookies';
var url = 'http://dashboard.vcapitaltraders.com/api/traders';

export async function getAllTrades() {
    console.log('Hi from api file');
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