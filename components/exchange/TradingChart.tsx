import * as React from "react";
import styles from "./index.module.css";
import { widget } from "../../public/static/charting_library";
import Datafeed from "components/exchange/api";
import {
  DISABLED_FEATURES,
  ENABLED_FEATURES,
  TIME_FRAMES,
} from "./api/chartConfig";
const theme = localStorage.getItem("theme");

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
type MyProps = {
  coinpair: any;
};
const pair = localStorage.getItem("current_pair")?.replace("_", "/");
export class TVChartContainer extends React.Component<MyProps> {
  static defaultProps = {
    //symbol: `:${pair && pair}`,
    symbol: `AAPL`,
    interval: "1D",
    containerId: "tv_chart_container",
    libraryPath: "/static/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    overrides: {
      "mainSeriesProperties.candleStyle.upColor": "#ffffff",
      "mainSeriesProperties.candleStyle.downColor": "#000000",
      "mainSeriesProperties.candleStyle.drawBorder": true,
      "mainSeriesProperties.candleStyle.borderUpColor": "#00ff00",
      "mainSeriesProperties.candleStyle.borderDownColor": "#ff0000",
    },
  };

  tvWidget = null;
  //@ts-ignore
  chartInit = (config) => {
    const tvWidget = new widget(config);
    if (document.documentElement.classList.contains("theme-dark")) {
      document.documentElement.classList.remove("theme-dark");
    }
    //@ts-ignore
    this.tvWidget = tvWidget;
    //@ts-ignore
    this.tvWidget.onChartReady(() => {
      //@ts-ignore
      this.tvWidget.applyOverrides({
        "paneProperties.background": theme === "dark" ? "#151515" : "#fff",
        //"paneProperties.background": "#fff",
        "paneProperties.backgroundType": "solid",
        //up and down color change32d777
        "mainSeriesProperties.candleStyle.upColor": "#32d777",
        "mainSeriesProperties.candleStyle.downColor": "#dc3545",
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor": "#32d777",
        "mainSeriesProperties.candleStyle.borderDownColor": "#dc3545",
        "mainSeriesProperties.candleStyle.wickUpColor": "#32d777",
        "mainSeriesProperties.candleStyle.wickDownColor": "#dc3545",
        "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
        "mainSeriesProperties.hollowCandleStyle.upColor": "#32d777",
        "mainSeriesProperties.hollowCandleStyle.downColor": "#dc3545",
        "mainSeriesProperties.hollowCandleStyle.drawWick": true,
        "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
        "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#32d777",
        "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#dc3545",
        "mainSeriesProperties.hollowCandleStyle.wickUpColor": "#32d777",
        "mainSeriesProperties.hollowCandleStyle.wickDownColor": "#dc3545",
        "mainSeriesProperties.haStyle.upColor": "#32d777",
        "mainSeriesProperties.haStyle.downColor": "#dc3545",
        "mainSeriesProperties.haStyle.drawWick": true,
        "mainSeriesProperties.haStyle.drawBorder": true,
        "mainSeriesProperties.haStyle.borderUpColor": "#32d777",
        "mainSeriesProperties.haStyle.borderDownColor": "#dc3545",
        "mainSeriesProperties.haStyle.wickUpColor": "#32d777",
        "mainSeriesProperties.haStyle.wickDownColor": "#dc3545",
        "mainSeriesProperties.barStyle.upColor": "#32d777",
        "mainSeriesProperties.barStyle.downColor": "#dc3545",
        "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
        "mainSeriesProperties.barStyle.dontDrawOpen": false,
        "mainSeriesProperties.lineStyle.color": "#dc3545",
      });
    });
  };
  //@ts-ignore
  constructor(props) {
    super(props);
    //@ts-ignore
    this.ref = React.createRef();
  }

  componentDidMount() {
    const widgetOptions = {
      height: 480,
      width: 1400,

      //@ts-ignore
      symbol: this.props.symbol,
      style: 1,
      theme: theme === "dark" ? "dark" : "light",
      //@ts-ignore
      datafeed: Datafeed,
      //@ts-ignore
      interval: this.props.interval,
      //@ts-ignore
      container: this.ref.current,
      //@ts-ignore
      library_path: this.props.libraryPath,
      //@ts-ignore
      locale: getLanguageFromURL() || "en",
      //@ts-ignore
      charts_storage_url: this.props.chartsStorageUrl,
      //@ts-ignore
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      //@ts-ignore
      client_id: this.props.clientId,
      //@ts-ignore
      user_id: this.props.userId,
      //@ts-ignore
      fullscreen: this.props.fullscreen,
      //@ts-ignore
      autosize: this.props.autosize,
      //@ts-ignore
      studies_overrides: this.props.studiesOverrides,
      // drawings_access: { type: "black", tools: [{ name: "Regression Trend" }] },
      //@ts-ignore
      enabled_features: ENABLED_FEATURES,
      //@ts-ignore
      disabled_features: DISABLED_FEATURES,

      //@ts-ignore
      // overrides: getChartOverrides(this.props.theme),
      custom_css_url: "css/style.css",
      //@ts-ignore
      time_frames: TIME_FRAMES,

      //@ts-ignore
//       studies_overrides: {
//         "volume.volume.color.0": "#dc3545",
//         "volume.volume.color.1": "#32d777",
//         "volume.volume.transparency": 0,
//         "volume.volume ma.color": "#32d777",
//         "volume.volume ma.transparency": 0,
//         "volume.options.showStudyArguments": false,
//         "volume.options.showStudyTitles": false,
//         "volume.options.showStudyValues": false,
//         "volume.options.showLegend": false,
//         "volume.options.showStudyOutput": false,
//         "volume.options.showStudyOverlay": false,
//         "volume.options.showSeriesTitle": false,
//         "volume.options.showSeriesOHLC": false,
//         "volume.options.showBarChange": false,
//         "volume.options.showCountdown": false,
//       },
      toolbar: false,
    };
    console.log("datafeed test: ",widgetOptions.datafeed);
    //@ts-ignore
    this.chartInit(widgetOptions);
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      //@ts-ignore
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
    return (
      <>
        <header className={styles.VersionHeader}></header>
        {/* @ts-ignore */}
        <div ref={this.ref} className={styles.TVChartContainer} />
      </>
    );
  }
}
