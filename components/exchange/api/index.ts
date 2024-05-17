import historyProvider from "./historyProvider";
import stream from "./stream";
import {stockApiRequest, getConstSymbols, validateChartData, stockApiRequestV2} from './helpers';
//import {subscribeOnStream,unsubscribeFromStream} from './streaming.js';
import {subscribeOnStream,unsubscribeFromStream, socket} from './vcapitalStreaming.js';

interface symbolInterface {
  description: string;
  exchange: string;
  full_name: string; 
  symbol: string;
  type: string;
}
const supportedResolutions = [
  "1",
  "2",
  "3",
  "5",
  "15",
  "D",
];

const lastBarsCache = new Map();

const config = {
  supported_resolutions: supportedResolutions,
};
export default {
  onReady: (cb: any) => {
    console.log('[onReady]: Method call');
    cb(config);
  },
  searchSymbols: (
    userInput: any,
    exchange: any,
    symbolType: any,
    onResultReadyCallback: any
  ) => {
  	console.log('[searchSymbols]: Method call');
	const symbols = getConstSymbols();
	const newSymbols = symbols.filter(symbol => {
		const isExchangeValid = exchange === '' || symbol.exchange === exchange;
		const isFullSymbolContainsInput = symbol.full_name
			.toLowerCase()
			.indexOf(userInput.toLowerCase()) !== -1;
		return isExchangeValid && isFullSymbolContainsInput;
	});
	onResultReadyCallback(newSymbols);
  },
  resolveSymbol: (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any
  ) => {
	  console.log('symbolName: ', symbolName);
	  console.log('onSymbolResolvedCallback: ', onSymbolResolvedCallback);
	  // var symbol_stub = {
	  //     name: symbolName,
	  //     description: "AAPL Inc.",
	  //     type: "stock",
	  //     session: "0930-1600",
	  //     timezone: "America/New_York",
	  //     ticker: symbolName,
	  //     exchange: "NASDAQ",
	  //     minmov: 1,
	  //     pricescale: 100,
	  //     has_intraday: true,
	  //     has_daily: true,
	  //     intraday_multipliers: ["1", "60"],
	  //     supported_resolution: supportedResolutions,
	  //     volume_precision: 8,
	  //     data_status: "streaming",
	  //   }
    const symbols: symbolInterface[] = getConstSymbols();
    const symbolInfo = symbols.find(s => s.symbol === symbolName);
    if(!symbolInfo) return;
    var symbol_stub = {
      name: symbolName,
      description: symbolInfo.description,
      type: symbolInfo.type,
      session: "0930-1600",
      timezone: "America/New_York",
      ticker: symbolName,
      exchange: symbolInfo.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_daily: true,
      intraday_multipliers: ["1", "60"],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
    }
    setTimeout(function() {
	onSymbolResolvedCallback(symbol_stub)
    }, 0)
  },

  getBars: async function (
    symbolInfo: any,
    resolution: any,
    periodParams: any,
    onHistoryCallback: any,
    onError: any,
    interval: any
  ) {
//     const { from, to } = periodParams;
//     const countBack = periodParams.countBack;
//     const countForward = periodParams.countForward;
//     //@ts-ignore
//     historyProvider
//       .getBars(
//         symbolInfo,
//         resolution,
//         from * 1000,
//         to * 1000,
//         countBack,
//         countForward
//       )
//       //@ts-ignore
//       .then((bars: any) => {
//         if (bars.length) {
//           onHistoryCallback(bars, { noData: false });
//         } else {
//           onHistoryCallback(bars, { noData: true });
//         }
//       })
//       .catch((err: any) => {
//         onError(err);
//       });
	
    const { from, to, firstDataRequest } = periodParams;
    console.log('[getBars]: Method call', symbolInfo);
    console.log('[FROM AND TO]: ', to, from);
    let query = {};
    let resolutionQuery = '';
    if(resolution == '1D') {
      query = {
        symbol: symbolInfo.name,
        resolution: "D",
        from: from,
        to: to
      }
    } else if(parseInt(resolution) <= 60) {
      query = {
        symbol: symbolInfo.name,
        resolution: 1,
        from: from-160400,
        to: to
      }
    }
    console.log('query: ', query)
    try {
    	let data = await stockApiRequestV2("https://finnhub-websocket-dea5a4d752cf.herokuapp.com/candles" ,query);
	console.log(data)
      	if (data.s === "no_data") {
		onHistoryCallback([], {noData: true});
		return;
     	}
	let t = 0;
      	const bars = data.t.map((time: any, index: number) => {
	t = time*1000;
	return {
	  time: t,
	  low: data.l[index],
	  high: data.h[index],
	  open: data.o[index],
	  close: data.c[index]
	}
      });
      console.log('bars: ', bars);
	if (firstDataRequest) {
		lastBarsCache.set(symbolInfo.full_name, {...bars[bars.length - 1],});
	}
	console.log(`[getBars]: returned ${bars.length} bar(s)`)
	onHistoryCallback(bars, {noData: false})   
    } catch(err: any) {
      	console.log('[getBars]: Get error', err)
	onError(err)
    }
  },

  subscribeBars: (
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscribeUID: any,
    onResetCacheNeededCallback: any
  ) => {
//     stream.subscribeBars(
//       symbolInfo,
//       resolution,
//       onRealtimeCallback,
//       subscribeUID,
//       onResetCacheNeededCallback
//     );
	console.log('[subscribeBars]: Method call with subscriberUID:', symbolInfo);
	const test = 1234;
    	subscribeOnStream(
      		symbolInfo, resolution, onRealtimeCallback, subscribeUID,
      		onResetCacheNeededCallback, lastBarsCache.get(symbolInfo.full_name),
		test
	);
  },
  unsubscribeBars: (subscriberUID: any) => {
    //stream.unsubscribeBars(subscriberUID);
	console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
	unsubscribeFromStream(subscriberUID);
  },

  calculateHistoryDepth: (
    resolution: any,
    resolutionBack: any,
    intervalBack: any
  ) => {
    //optional

    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined;
  },
  getMarks: (
    symbolInfo: any,
    startDate: any,
    endDate: any,
    onDataCallback: any,
    resolution: any
  ) => {
    //optional
  },
  getTimeScaleMarks: (
    symbolInfo: any,
    startDate: any,
    endDate: any,
    onDataCallback: any,
    resolution: any
  ) => {
    //optional
  },
  getServerTime: (cb: any) => {},
};
