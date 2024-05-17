// ********************** Real Stock API *********************+
// Makes requests to CryptoCompare API
export async function stockApiRequest(path, resolution) {
    try {
        const response = await fetch(path);
        return response.json();
    } catch(error) {
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

export async function stockApiRequestV2 (path, options) {
    try {
        const response = await fetch(path, {
            method: 'POST', // or 'PUT' depending on your server's route
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(options),
        })
        const data = await response.json()
        return data
    } catch(error) {
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

//To implement real data on the final Application, this obj array must be retrieved from the DataBase
export function getConstSymbols() {
    const symbols = [
        {description: 'Apple Inc', exchange: 'NASDAQ', full_name: 'AAPL', symbol: 'AAPL',type: 'stock'},
        {description: 'MSFT electronics', exchange: 'NASDAQ', full_name: 'MSFT', symbol: 'MSFT', type: 'stock'},
        {description: 'AMZN amazon', exchange: 'NASDAQ', full_name: 'AMZN', symbol: 'AMZN', type: 'stock'},
        {description: 'Alibaba Group Holdings Ltd.', exchange: 'NYSE', full_name: 'BABA', symbol: 'BABA', type: 'stock'},
        {description: 'Bank of America Corporation', exchange: 'NYSE', full_name: 'BAC', symbol: 'BAC', type: 'stock'},
        {description: 'UBER Technologies, Inc', exchange: 'NYSE', full_name: 'UBER', symbol: 'UBER', type: 'stock'},
        {description: 'Advanced Micro devices Inc', exchange: 'NASDAQ', full_name: 'AMD', symbol: 'AMD', type: 'stock'}, 
        {description: 'Citigroup, Inc', exchange: 'NYSE', full_name: 'C', symbol: 'C', type: 'stock'}, 
        // {description: 'Cisco System, Inc', exchange: 'NASDAQ', full_name: 'CSCO', symbol: 'CSCO', type: 'stock'}, 
        {description: 'eBay Inc', exchange: 'NASDAQ', full_name: 'EBAY', symbol: 'EBAY', type: 'stock'}, 
        {description: 'Gilead Sciences Inc', exchange: 'NASDAQ', full_name: 'GILD', symbol: 'GILD', type: 'stock'}, 
        {description: 'Coca-Cola Company', exchange: 'NYSE', full_name: 'KO', symbol: 'KO', type: 'stock'}, 
        {description: 'JD.com, Inc', exchange: 'NASDAQ', full_name: 'JD', symbol: 'JD', type: 'stock'}, 
        {description: 'Morgan Stanley', exchange: 'NYSE', full_name: 'MS', symbol: 'MS', type: 'stock'}, 
        {description: 'Oracle Comporation', exchange: 'NYSE', full_name: 'ORCL', symbol: 'ORCL', type: 'stock'}, 
        {description: 'Qualcomm Incorporated', exchange: 'NASDAQ', full_name: 'QCOM', symbol: 'QCOM', type: 'stock'}, 
        {description: 'United Airlines Holding Inc', exchange: 'NASDAQ', full_name: 'UAL', symbol: 'UAL', type: 'stock'}, 
        {description: 'Western Digital Corporation', exchange: 'NASDAQ', full_name: 'WDC', symbol: 'WDC', type: 'stock'}, 
        {description: 'Exxon Movil Corporation', exchange: 'NYSE', full_name: 'XOM', symbol: 'XOM', type: 'stock'}, 
        // {description: 'NVIDIA Corporation', exchange: 'NASDAQ', full_name: 'NVDA', symbol: 'NVDA', type: 'stock'}, 
        {description: 'Micron Technology', exchange: 'NASDAQ', full_name: 'MU', symbol: 'MU', type: 'stock'}, 
        {description: 'Block, Inc', exchange: 'NYSE', full_name: 'SQ', symbol: 'SQ', type: 'stock'}, 
        // {description: 'Chevron Corporation', exchange: 'NYSE', full_name: 'CVX', symbol: 'CVX', type: 'stock'}, 
        // {description: 'Tesla, Inc', exchange: 'NASDAQ', full_name: 'TSLA', symbol: 'TSLA', type: 'stock'}, 
        {description: 'Paypal Holdings, Inc', exchange: 'NASDAQ', full_name: 'PYPL', symbol: 'PYPL', type: 'stock'}, 
        {description: 'Meta Platforms, Inc', exchange: 'NASDAQ', full_name: 'META', symbol: 'META', type: 'stock'}, 
        {description: 'Walt Disney Company', exchange: 'NYSE', full_name: 'DIS', symbol: 'DIS', type: 'stock'}, 
        {description: 'JPM', exchange: 'NYSE', full_name: 'JPM', symbol: 'JPM', type: 'stock'}, 
        {description: 'INTC', exchange: 'NYSE', full_name: 'INTC', symbol: 'INTC', type: 'stock'}, 
        {description: 'WFC', exchange: 'NYSE', full_name: 'WFC', symbol: 'WFC', type: 'stock'}, 
        {description: 'NKE', exchange: 'NYSE', full_name: 'NKE', symbol: 'NKE', type: 'stock'}, 
        {description: 'Starbucks Corporation', exchange: 'NASDAQ', full_name: 'SBUX', symbol: 'SBUX', type: 'stock'}, 
        {description: 'Chevron Corporation', exchange: 'NYSE', full_name: 'CVX', symbol: 'CVX', type: 'stock'}, 
        {description: 'Western Digital Corporation', exchange: 'NASDAQ', full_name: 'WDC', symbol: 'WDC', type: 'stock'}, 
        {description: 'Las Vegas Sands Corp', exchange: 'NYSE', full_name: 'LVS', symbol: 'LVS', type: 'stock'}, 
        {description: 'Direction Daily Gold Miners Indes Bull', exchange: 'NYSE', full_name: 'NUGT', symbol: 'NUGT', type: 'stock'},  
        {description: 'Roku, Inc', exchange: 'NYSE', full_name: 'ROKU', symbol: 'ROKU', type: 'stock'},  
        {description: 'SPDR S&P 500 ETF TRUST', exchange: 'NYSE', full_name: 'SPY', symbol: 'SPY', type: 'stock'},  
        // {description: 'Verizon Communications Inc', exchange: 'NYSE', full_name: 'VZ', symbol: 'VZ', type: 'stock'}, 
        // {description: 'Bitcoin', exchange: 'BINANCE', full_name: 'BINANCE:BTCUSDT', symbol: 'BINANCE:BTCUSDT', type: 'crypto'}, 
        // {description: 'Ethereum', exchange: 'BINANCE', full_name: 'BINANCE:ETHUSDT', symbol: 'BINANCE:ETHUSDT', type: 'crypto'}
    ];
    return symbols;
}

export function validateChartData(from, to) {
    const toDate = new Date(to * 1000);
    const weekDay = toDate.getDay();
    let minusDays = (weekDay === 1 || weekDay === 0) ? 3 : 1;
    minusDays = minusDays * 24 * 60 * 60;
    from = from - minusDays;

    return from;
}
