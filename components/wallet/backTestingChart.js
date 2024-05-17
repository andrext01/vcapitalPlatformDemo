import { createChart } from 'lightweight-charts';

var globalState = false;

export function chart(trades) {
    console.log('hello function CHART');
    console.log('globalState', globalState);
    if(globalState) return;
    globalState = true;
    
    const chartOptions = { 
        layout: { textColor: 'white', background: { type: 'solid', color: '#4a5a64' } },
        grid: { vertLines: { color: '#4a5a64' }, horzLines: { color: '#4a5a64' } },
        crosshair: { mode: 0 },
    };

    // const chartOptions = { layout: { textColor: 'white', background: { type: 'solid', color: '#2a2a2d' } } };
    const chart = createChart(document.getElementById('newChart'), chartOptions);

    /*****************************+ FUNCTION TO SET DAILY BARS *************************** */
    let arrayDeObjetos = [];
    let actualDate = trades[0].time;
    let open = trades[0].netPL;
    let close = trades[0].netPL;
    let high = trades[0].netPL;
    let low = trades[0].netPL;
    let dailyBalance = 0;
    let nextOpen = 0;

    trades.forEach((numero, index) => {
        const fechaObjeto1 = new Date(actualDate);
        const fechaObjeto2 = new Date(numero.time);
        
        const diaFecha1 = fechaObjeto1.getDate();
        const mesFecha1 = fechaObjeto1.getMonth() + 1; // El mes se indexa desde 0 (enero) hasta 11 (diciembre)
        const diaFecha2 = fechaObjeto2.getDate();
        const mesFecha2 = fechaObjeto2.getMonth() + 1;
        
        if(!(diaFecha1 === diaFecha2 && mesFecha1 === mesFecha2)) nextOpen = dailyBalance;
        dailyBalance += numero.netPL;
        
        if (diaFecha1 === diaFecha2 && mesFecha1 === mesFecha2) {
        if(dailyBalance < low) { low = dailyBalance; }
        if(dailyBalance > high) { high = dailyBalance; }
        close = dailyBalance;
        } else {
            arrayDeObjetos.push({ open: open, high: high, low: low, close: close, time: actualDate });
            open = nextOpen;
            if(dailyBalance < open) { low = dailyBalance; } else { low = open; }
            if(dailyBalance > open) { high = dailyBalance; } else { high = open; }
            close = dailyBalance;
        }
        actualDate = numero.time;
    });
    arrayDeObjetos.push({ open: open, high: high, low: low, close: close, time: actualDate });
    /*****************************+ FUNCTION TO SET DAILY BARS *************************************** */

    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#17de43', downColor: '#dc3535', borderVisible: false,
        wickUpColor: '#388e3c', wickDownColor: '#b22833',
    });

    candlestickSeries.setData(arrayDeObjetos);
    chart.timeScale().fitContent();
    chart.priceScale().applyOptions({
        borderColor: '#71649C',
    });
    
    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
        borderColor: '#71649C',
    });
}
//consols