import type { GetServerSideProps, NextPage } from "next";
import ReportSidebar from "layout/report-sidebar";
import React, { useState } from "react";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import {
  ReferralHistoryAction,
  handleSearchItems,
} from "state/actions/reports";
import SectionLoading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { formatCurrency } from "common";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import { useRouter } from "next/router";

const ReferralEarningTrade: NextPage = () => {
  type searchType = string;
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<searchType>("");
  const router = useRouter();
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const { settings } = useSelector((state: RootState) => state.common);
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  console.log(stillHistory, "stillHistory");

  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    ReferralHistoryAction(
      10,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      router.query.id
    );
  };
  const getReport = async () => {
    ReferralHistoryAction(
      10,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      router.query.id
    );
  };
  const columns = [
    {
      name: t("Referral user email"),
      selector: (row: any) => row?.referral_user_email,
      sortable: true,
    },
    {
      name: t("Transaction id"),
      selector: (row: any) => row?.transaction_id,
      sortable: true,
    },
    {
      name: t("Amount"),
      selector: (row: any) => `${row?.amount} ${row?.coin_type}`,
      sortable: true,
    },
    {
      name: t("Date"),
      selector: (row: any) =>
        moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
  ];

  React.useEffect(() => {
    getReport();
    return () => {
      setHistory([]);
    };
  }, []);
  return (
    <>
      <div className="page-wrap rightMargin">
        <ReportSidebar />

        <div className="page-main-content">
          <div className="container-fluid">
            <div className="section-top-wrap mb-25">
              <div className="overview-area">
                <div className="overview-left">
                  <h2 className="section-top-title">
                    {t("Referral earning trade")}
                  </h2>
                </div>
              </div>
            </div>

            <div className="asset-balances-area">
              {processing ? (
                <SectionLoading />
              ) : (
                <div className="asset-balances-left">
                  <div className="section-wrapper boxShadow ">
                    <div className="tableScroll">
                      <div
                        id="assetBalances_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        <div className="dataTables_head">
                          <div
                            className="dataTables_length"
                            id="assetBalances_length"
                          >
                            <label className="">
                              {t("Show")}
                              <select
                                name="assetBalances_length"
                                aria-controls="assetBalances"
                                className=""
                                placeholder="10"
                                onChange={(e) => {
                                  ReferralHistoryAction(
                                    parseInt(e.target.value),
                                    1,
                                    setHistory,
                                    setProcessing,
                                    setStillHistory,
                                    sortingInfo.column_name,
                                    sortingInfo.order_by,
                                    router.query.id
                                  );
                                }}
                              >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                              </select>
                            </label>
                          </div>
                          <div id="table_filter" className="dataTables_filter">
                            <label>
                              {t("Search")}
                              <input
                                type="search"
                                className="data_table_input"
                                placeholder=""
                                aria-controls="table"
                                value={search}
                                onChange={(e) => {
                                  handleSearchItems(
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
                      {history?.length > 0 && (
                        <div
                          className="pagination-wrapper"
                          id="assetBalances_paginate"
                        >
                          <span>
                            {stillHistory?.links?.map(
                              (link: any, index: number) =>
                                link.label === "&laquo; Previous" ? (
                                  <a
                                    className="paginate-button"
                                    onClick={() => {
                                      if (link.url)
                                        LinkTopaginationString(link);
                                    }}
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
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/buy-order-history");
  return {
    props: {},
  };
};

export default ReferralEarningTrade;
