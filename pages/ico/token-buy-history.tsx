import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import { useEffect, useState } from "react";
import {
  getTokenBuyHistoryAction,
  GetTokenListAction,
} from "state/actions/launchpad";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";

import {
  STATUS_ACCEPTED,
  STATUS_MODIFICATION,
  STATUS_PENDING,
} from "helpers/core-constants";

const TokenBuyHistory = () => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);
  const columns = [
    {
      name: t("Token Name"),
      selector: (row: any) => row?.token_name,
      sortable: true,
    },

    {
      name: t("Amount"),
      selector: (row: any) => row?.amount,
      sortable: true,
      cell: (row: any) => (
        <div>
          {row?.amount} {row?.token_name}
        </div>
      ),
    },
    {
      name: t("Amount Paid"),
      selector: (row: any) => row?.amount,
      sortable: true,
      cell: (row: any) => (
        <div>
          {row?.pay_amount} {row?.pay_currency}
        </div>
      ),
    },
    {
      name: t("Approved Status"),
      selector: (row: any) => row?.status,
      sortable: true,
      cell: (row: any) => (
        <div>
          {row.status === STATUS_PENDING ? (
            <span className="text-warning">{t("Pending")}</span>
          ) : row.status === STATUS_ACCEPTED ? (
            <span className="text-success"> {t("Accepted")}</span>
          ) : row.status === STATUS_MODIFICATION ? (
            <span className="text-warning"> {t("Modification request")}</span>
          ) : (
            <span className="text-danger">{t("Rejected")}</span>
          )}
        </div>
      ),
    },
    {
      name: t("Transaction Id"),
      selector: (row: any) => row?.trx_id,
      sortable: true,
    },
    {
      name: t("Payment Method"),
      selector: (row: any) => row?.payment_method,
      sortable: true,
    },
    {
      name: t("Date"),
      selector: (row: any) =>
        moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    getTokenBuyHistoryAction(
      10,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by
    );
  };
  useEffect(() => {
    getTokenBuyHistoryAction(
      10,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by
    );
  }, []);
  return (
    <>
      <div className="page-wrap">
        <LaunchpadSidebar />
        <div className="page-main-content">
          <div className="container-fluid">
            <div className="section-top-wrap mb-25">
              <div className="profle-are-top">
                <h2 className="section-top-title">{t("Token Buy History")}</h2>
              </div>
            </div>
            <div className="asset-balances-area">
              <div className="asset-balances-left">
                <div className="section-wrapper boxShadow">
                  <div className="tableScroll">
                    <div
                      id="assetBalances_wrapper"
                      className="dataTables_wrapper no-footer">
                      <div className="dataTables_head">
                        <div id="table_filter" className="dataTables_filter">
                          <label>
                            {t("Search:")}
                            <input
                              type="search"
                              className="data_table_input"
                              aria-controls="table"
                              value={search}
                              onChange={(e) => {
                                handleSwapHistorySearch(
                                  e,
                                  setSearch,
                                  stillHistory,
                                  setHistory
                                );
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <DataTable columns={columns} data={history} />
                    {history.length > 0 && (
                      <div
                        className="pagination-wrapper"
                        id="assetBalances_paginate">
                        <span>
                          {stillHistory?.links?.map(
                            (link: any, index: number) =>
                              link.label === "&laquo; Previous" ? (
                                <a
                                  className="paginate-button"
                                  onClick={() => {
                                    if (link.url) LinkTopaginationString(link);
                                  }}
                                  key={index}>
                                  <i className="fa fa-angle-left"></i>
                                </a>
                              ) : link.label === "Next &raquo;" ? (
                                <a
                                  className="paginate-button"
                                  onClick={() => LinkTopaginationString(link)}
                                  key={index}>
                                  <i className="fa fa-angle-right"></i>
                                </a>
                              ) : (
                                <a
                                  className="paginate_button paginate-number"
                                  aria-controls="assetBalances"
                                  data-dt-idx="1"
                                  onClick={() => LinkTopaginationString(link)}
                                  key={index}>
                                  {link.label}
                                </a>
                              )
                          )}
                        </span>
                      </div>
                    )}
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
  await SSRAuthCheck(ctx, "/user/profile");
  return {
    props: {},
  };
};
export default TokenBuyHistory;
