"use client"
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { TiArrowRepeat } from "react-icons/ti";

import {
  HiOutlineBanknotes,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";

import {
  SearchObjectArrayFuesJS,
  WalletListApiAction,
} from "state/actions/wallet";
import {getAllTrades, getBalance} from "../../../service/tradesService";
// import {estadisticsData} from "./estadistics";
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { TradeList } from "components/TradeList";
import { appDashboardDataWithoutPair } from "service/exchange";
import Footer from "components/common/footer";
import {chart} from "../../../components/wallet/backTestingChart"
// import { createChart } from 'lightweight-charts';
// import "./backTestingStyles.css";
// import Card from 'react-bootstrap/Card'; vvvv gggg

interface balanceInterface {
  balance: number;
  status: boolean
}

interface backTestingInterface {
  totalTrades: number;
}

interface TradeInterface {
  OpenPrice: number;
  id: number;
  quantity: number;
  side: number;
  symbol: string;
  close: number;
  usuId: number;
  netPL: number;
  currentPrice: number;
  stop: number;
  profit: number;
  time: string;
  created_at: string;
  updated_at: string;
}

const MyWallet: NextPage = () => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  const [walletList, setWalletList] = useState<any>([]);
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [allData, setAllData] = useState<any>();
  const [tradeList, setTradeList]: any = useState();
  const [coinList, setCoinList]: any = useState([]);
  // const [backTesting, setBackTesting] = useState<backTestingInterface>();
  const [totalTrades, setTotalTrades] = useState<number>();
  const [bestTrade, setBestTrade] = useState<string>();
  const [bestSymbol, setBestSymbol] = useState<string>();
  const [worstTrade, setWorstTrade] = useState<string>();
  const [worstSymbol, setWorstSymbol] = useState<string>();
  const [winingRadio, setWiningRadio] = useState<number>();
  const [PayRadio, setPayRadio] = useState<number>();
  const [averageLosing, setAverageLosing] = useState<number>();
  const [averageWinning, setAverageWinning] = useState<number>();
  const [totalBalance, setTotalBalance] = useState<number>();
  const [loss, setLoss] = useState<string>();
  const [profit, setProfit] = useState<string>();
  const [state, setState] = useState(false);

  const card = {
    border: "1px solid #4a5a64",
    borderRadius: "8px",
    padding: "10px",
    margin: "10px",
    backgroundColor: "#4a5a64"
  };
  const cardTitle = {
    fontSize: "1.6rem",
    marginBottom: "10px"
  };
  const cardContent = {
    fontSize: "1.8rem",
    color: "#5AC3E3"
  };
  const cardContentTrades = {
    fontSize: "1.6rem",
    color: "#5AC3E3"
  };
  const cardContentLossWin = {
    fontSize: "1.3rem",
    color: "#5AC3E3"
  };
  const cardBox = {
    width: "50%"
  }
  let charVar = 0;

  const handleActive = (index: any) => {
    if (index === tradeList) {
      setTradeList(index);
    } else {
      setTradeList(index);
    }
  };

  useEffect(() => {
    const getBalanceData = async () => {
      let resp: balanceInterface = {
        balance: 0,
        status: false
      }
      const dataBalance = await getBalance();
      console.log('dataOrders: ', dataBalance);
      if(dataBalance.status === true && dataBalance.data.length > 0){
        resp.balance = dataBalance.data[0].balance;
        resp.status = true;
        return resp;
      } else {
        return resp;
      }
    }

    const getTrades = async () => {
      let estadisticsData: backTestingInterface = {
        totalTrades: 0
      }
      let bT = '';
      let wT = '';
      const dataTraders = await getAllTrades();
      console.log('dataOrders: ', dataTraders);
      if(dataTraders.status === true && dataTraders.data.length !== 0){
        const balanceData = await getBalanceData();
        if(balanceData.status) {
          estadisticsData.totalTrades = dataTraders.data.length;
          const { mayor, menor, payRadio, worstSymbol, bestSymbol, 
                  winRadio, totalTrades, loss, profit } = encontrarMayorYMenor(dataTraders.data);
          console.log('payRadio: ', payRadio, 'winRadio', winRadio);
          if(mayor != undefined) {
            bT = (mayor < 0) ? '-$' + Math.abs(mayor).toString() : '$' + mayor.toString();
          }
          if(menor != undefined) {
            wT = (menor < 0) ? '-$' + Math.abs(menor).toString() : '$' + menor.toString();
          }
          const lossString = (loss == undefined) ? '' : "$" + loss.toString();
          const profitString = (profit == undefined) ? '' : "$" + profit.toString();

          setTotalTrades(totalTrades);
          setTotalBalance(balanceData.balance);
          setBestTrade(bT);
          setWorstTrade(wT);
          setBestSymbol(bestSymbol);
          setWorstSymbol(worstSymbol);
          setPayRadio(payRadio);
          setWiningRadio(winRadio);
          setLoss(lossString);
          setProfit(profitString);
          
          chart(dataTraders.data);
        } else {
          alert('No se obtuvo los datos del balance y trades, por favor, refrescar la página');
        }
      } else {
        alert('No se obtuvo los datos del balance y trades, por favor, refrescar la página');
      }
    }

    getTrades();
  }, []);

  const encontrarMayorYMenor = (arreglo: TradeInterface[]): { mayor: number | undefined, menor: number | undefined, 
                                                              payRadio: number | undefined, worstSymbol: string, 
                                                              bestSymbol: string, winRadio: number | undefined, 
                                                              totalTrades: number | undefined, loss: number | undefined,
                                                              profit: number | undefined } => {
    if (arreglo.length === 0) {
      return { mayor: undefined, menor: undefined, payRadio: undefined, worstSymbol: '', 
                bestSymbol: '', winRadio: undefined, totalTrades: undefined, loss: undefined, profit: undefined };
    }
  
    let mayor = arreglo[0].netPL;
    let bestSymbol = '';
    let menor = arreglo[0].netPL;
    let worstSymbol = '';
    let loss = 0;
    let profit = 0;
    let winTrades = 0;
    let totalTrades = 0;
    
    console.log('arrelgo time last ', arreglo[arreglo.length]);
    console.log('arrelgo  length ', arreglo.length);
    const lastDate = new Date(arreglo[arreglo.length-1].time);
  
    arreglo.forEach((elemento) => {
      const elementDate = new Date(elemento.time);
      const resultado = diferenciaEnDias(elementDate, lastDate);

      if(resultado) {
        totalTrades++;
        if (elemento.netPL > mayor) {
          mayor = elemento.netPL;
          bestSymbol = elemento.symbol;
        }
        if (elemento.netPL < menor) {
          menor = elemento.netPL;
          worstSymbol = elemento.symbol;
        }

        if(elemento.netPL > 0) {
          profit += Math.abs(elemento.netPL);
          winTrades++;
        } else if(elemento.netPL < 0) {
          loss += Math.abs(elemento.netPL);
        }
      }
    });

    console.log('winTrades into function', winTrades);
    
    const payRadio = parseFloat((profit/loss).toFixed(1));
    const winRadio = parseFloat(((winTrades/totalTrades)*100).toFixed(1));
  
    return { mayor, menor, payRadio, worstSymbol, bestSymbol, winRadio, totalTrades, loss, profit };
  };

  function diferenciaEnDias(fechaInicio: Date, fechaFin: Date): boolean {
    // Calcula la diferencia en milisegundos entre las dos fechas
    const diferenciaMs = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
  
    // Convierte la diferencia de milisegundos a días
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
  
    // Verifica si la diferencia de días es menor o igual a 5
    return diferenciaDias <= 8;
  }

  const getWalletLists = async (url: string) => {
    const response: any = await WalletListApiAction(url, setProcessing);
    setWalletList(response?.wallets);
    setChangeable(response?.wallets?.data);
    setAllData(response);
  };

  const LinkTopaginationString = async (link: any) => {
    if (link.url === null) return;
    if (link.label === walletList.current_page.toString()) return;
    const splitLink = link.url.split("api");
    const response: any = await WalletListApiAction(
      splitLink[1] + "&per_page=15",
      setProcessing
    );
    setWalletList(response?.wallets);
    setChangeable(response?.wallets?.data);
  };

  const coinListApi = async () => {
    const coinList = await appDashboardDataWithoutPair();
    setCoinList(coinList);
  };

  useEffect(() => {
    coinListApi();
    getWalletLists("/wallet-list?page=1&per_page=15");
    return () => {
      setWalletList(null);
    };
  }, []);

  return (
    <>
      <div className="page-wrap">
        <div className="page-main-content container-fluid">
          <div className="section-top-wrap mb-25">
            <div className="overview-area">
              <div className="overview-left">
                <h2 className="section-top-title">{t("Overview")}</h2>
                <h4 className="blance-title">{t("Total balance")}</h4>
                <h4 className="blance">
                  {totalBalance ? totalBalance : 0}
                  {""} {settings?.currency}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-wrap">
        <div className="page-main-content">
          <div className="container-fluid">
            <div className="asset-balances-area cstm-loader-area">
              <div className="asset-balances-left">
                <div className="section-wrapper">

                  {processing ? (
                    <Loading />
                  ) : (
                    <div className="row">
                      <div className="col-xl-2">
                        <div style={card}>
                          <div style={cardTitle}>
                            {t("Total de trades")}
                          </div>
                          <div style={cardContent}>
                            {totalTrades}
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-2">
                        <div style={card}>
                          <div style={cardTitle}>
                            {t("Mejor trade")}
                          </div>
                          <div style={cardContentTrades}>
                            {bestSymbol} {""} {bestTrade}
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-2">
                        <div style={card}>
                          <div style={cardTitle}>
                            {t("Peor trade")}
                          </div>
                          <div style={cardContentTrades}>
                          {worstSymbol} {""} {worstTrade}
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-2">
                        <div style={card}>
                          <div style={cardTitle}>
                            {t("Pay Radio")}
                          </div>
                          <div style={cardContent}>
                            {PayRadio}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-xl-2">
                        <div style={card}>
                          <div style={cardTitle}>
                            {t("Winning Radio")}
                          </div>
                          <div style={cardContent}>
                            {winingRadio} {"%"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-xl-2">
                        <div style={card}>
                          <div style={cardTitle}>
                            {t("Loss | Win")}
                          </div>
                          <div style={cardContentLossWin}>
                            {loss}{" | "}{profit}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <div id="newChart" style={{width: '70%', height: '500px'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet");
  return {
    props: {},
  };
};

export default MyWallet;
