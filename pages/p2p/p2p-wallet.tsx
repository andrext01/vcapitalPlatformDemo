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
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { TradeList } from "components/TradeList";
import { appDashboardDataWithoutPair } from "service/exchange";
import Footer from "components/common/footer";
import { getWalletsAction } from "state/actions/p2p";
import { SiConvertio } from "react-icons/si";
import { AiOutlineSend } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
const MyWallet: NextPage = () => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  const [walletList, setWalletList] = useState<any>([]);
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [tradeList, setTradeList]: any = useState();

  const getWalletLists = async () => {
    const response: any = await getWalletsAction(10, 1);
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
  };

  const LinkTopaginationString = async (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    const response: any = await getWalletsAction(10, number);
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
  };

  useEffect(() => {
    getWalletLists();
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
                <h2 className="section-top-title">{t("P2P Wallet")}</h2>
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
                  <div
                    id="assetBalances_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    <div className="dataTables_head">
                      <div id="table_filter" className="dataTables_filter">
                        <label>
                          {t("Search")}:
                          <input
                            type="search"
                            className="data_table_input"
                            placeholder=""
                            aria-controls="table"
                            onChange={(e) =>
                              SearchObjectArrayFuesJS(
                                walletList,
                                setChangeable,
                                e.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {processing ? (
                    <Loading />
                  ) : (
                    <div className="table-responsive walletTableScroll">
                      <table
                        id="assetBalances"
                        className="table table-borderless secendary-table asset-balances-table"
                      >
                        <thead>
                          <tr>
                            <th scope="col">{t("Asset")}</th>
                            <th scope="col">{t("Symbol")}</th>
                            <th scope="col">{t("Available Balance")}</th>
                            <th scope="col">{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Changeable?.map((item: any, index: number) => (
                            <tr id="" key={index}>
                              <td>
                                <div className="asset">
                                  <img
                                    className="asset-icon"
                                    src={item.coin_icon || "/bitcoin.png"}
                                    alt=""
                                  />
                                  <span className="asset-name">
                                    {item?.name}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="symbol">
                                  {item?.coin_type}
                                </span>
                              </td>

                              <td>
                                <div className="blance-text">
                                  <span className="blance">
                                    {parseFloat(item?.balance).toFixed(8)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="active-link">
                                  <ul>
                                    <div className="active-link">
                                      <ul>
                                        <Link
                                          href={`/p2p/exchange/1/${item?.coin_type}`}
                                        >
                                          <li>
                                            <AiOutlineSend />
                                          </li>
                                        </Link>
                                        <Link
                                          href={`/p2p/exchange/2/${item?.coin_type}`}
                                        >
                                          <li>
                                            <BsWallet2 />
                                          </li>
                                        </Link>
                                      </ul>
                                    </div>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div
                    className="pagination-wrapper"
                    id="assetBalances_paginate"
                  >
                    <span>
                      {walletList?.links?.map((link: any, index: number) =>
                        link.label === "&laquo; Previous" ? (
                          <a
                            className="paginate-button"
                            onClick={() => LinkTopaginationString(link)}
                            key={index}
                          >
                            <i className="fa fa-angle-left"></i>
                          </a>
                        ) : link.label === "Next &raquo;" ? (
                          <a
                            className="paginate-button"
                            onClick={() => LinkTopaginationString(link)}
                            key={index}
                          >
                            <i className="fa fa-angle-right"></i>
                          </a>
                        ) : (
                          <a
                            className={`paginate_button paginate-number ${
                              link.active === true && "text-warning"
                            }`}
                            aria-controls="assetBalances"
                            data-dt-idx="1"
                            onClick={() => LinkTopaginationString(link)}
                            key={index}
                          >
                            {link.label}
                          </a>
                        )
                      )}
                    </span>
                  </div>
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
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};

export default MyWallet;
