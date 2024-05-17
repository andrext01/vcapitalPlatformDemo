import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import { useEffect, useState } from "react";
import { GetTokenListAction } from "state/actions/launchpad";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";
import { MdCreateNewFolder } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineOrderedList } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  STATUS_ACCEPTED,
  STATUS_MODIFICATION,
  STATUS_PENDING,
} from "helpers/core-constants";
import { BsFillChatFill } from "react-icons/bs";
const Profile: NextPage = ({}: any) => {
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
      name: t("Base Coin"),
      selector: (row: any) => row?.base_coin,
      sortable: true,
    },
    {
      name: t("Token Name"),
      selector: (row: any) => row?.token_name,
      sortable: true,
    },

    {
      name: t("Approved Status"),
      selector: (row: any) => row?.approved_status,
      sortable: true,
      cell: (row: any) => (
        <div>
          {row.approved_status === STATUS_PENDING ? (
            <span className="text-warning">{t("Pending")}</span>
          ) : row.approved_status === STATUS_ACCEPTED ? (
            <span className="text-success"> {t("Accepted")}</span>
          ) : row.approved_status === STATUS_MODIFICATION ? (
            <span className="text-warning"> {t("Modification request")}</span>
          ) : (
            <span className="text-danger">{t("Rejected")}</span>
          )}
        </div>
      ),
    },
    {
      name: t("Date"),
      selector: (row: any) =>
        moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      name: t("Wallet Address"),
      selector: (row: any) => row?.wallet_address,
      sortable: true,
    },
    {
      name: t("Actions"),
      selector: (row: any) => row?.status,
      sortable: true,
      cell: (row: any) => (
        <div className="blance-text">
          {row.approved_status === 1 ? (
            <Link href={`/ico/create-edit-phase/${row?.id}`}>
              <li className="toolTip" title="Create Phase">
                <MdCreateNewFolder size={20} />
              </li>
            </Link>
          ) : (
            <li
              className="toolTip"
              title="Create Phase"
              onClick={() => {
                toast.warning(
                  t("Cannot create phase,Please wait for token approval!")
                );
              }}>
              <MdCreateNewFolder size={20} />
            </li>
          )}
          <Link href={`/chat/${row?.id}`}>
            <li className="toolTip ml-2" title="Chat">
              <BsFillChatFill size={20} />
            </li>
          </Link>
          <Link href={`/ico/create-edit-token/${row?.id}?edit=true`}>
            <li className="toolTip ml-2" title="Edit token">
              <IoCreateOutline size={20} />
            </li>
          </Link>
          <Link href={`/ico/token-phase-list/${row?.id}`}>
            <li className="toolTip ml-2" title="Phase List">
              <AiOutlineOrderedList size={20} />
            </li>
          </Link>
        </div>
      ),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    GetTokenListAction(
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
    GetTokenListAction(
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
                <h2 className="section-top-title">{t("ICO Token")}</h2>
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
                    <div
                      className="pagination-wrapper"
                      id="assetBalances_paginate">
                      <span>
                        {stillHistory?.links?.map((link: any, index: number) =>
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
export default Profile;
