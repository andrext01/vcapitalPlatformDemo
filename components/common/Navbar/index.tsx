import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BsBarChartLine, BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { BiNetworkChart } from "react-icons/bi";
import { IoLanguageSharp } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { HiOutlineDocumentReport } from "react-icons/hi";

import { BiWalletAlt } from "react-icons/bi";
import { RiCalendarEventLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state/store";
import { notification, notificationSeen } from "service/notification";
import useTranslation from "next-translate/useTranslation";
import OutsideClickHandler from "react-outside-click-handler";
import UnAuthNav from "../unAuthNav";
import { checkThemeState } from "helpers/functions";
import NotificationDropdown from "./notification-dropdown";
import { setNotificationData } from "state/reducer/user";
import { IoMdGlobe } from "react-icons/io";
import {
  REFERRAL_TYPE_DEPOSIT,
  REFERRAL_TYPE_TRADE,
} from "helpers/core-constants";

const Navbar = ({ settings, isLoggedIn }: any) => {
  const { isLoading, user, logo, notificationData } = useSelector(
    (state: RootState) => state.user
  );
  const [theme, setTheme] = useState(0);
  const dispatch = useDispatch();
  const { navbar } = settings;
  const { t } = useTranslation("common");
  const [active, setActive] = useState(false);
  const router = useRouter();
  const getNotifications = async () => {
    const data = await notification();
    dispatch(setNotificationData(data.data.data));
  };
  const seen = async () => {
    let arr: any = [];

    notificationData.map((notification: any) => {
      arr.push(notification.id);
    });
    notificationSeen(arr).then((data: any) => {
      dispatch(setNotificationData([]));
    });
  };
  useEffect(() => {
    checkThemeState(setTheme);
    isLoggedIn && getNotifications();
  }, [isLoggedIn]);
  useEffect(() => {
    if (router.locale === "ar") {
      document.body.classList.add("rtl-style");
    } else {
      document.body.classList.remove("rtl-style");
    }
  }, [router.locale]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className="cp-user-top-bar">
            <div className="container-fluid">
              <div className="row align-items-center justify-content-between">
                <div className="col-xl-2 col-lg-2 col-4">
                  <div className="cp-user-logo">
                    <Link href="/">
                      <a href="">
                        <img
                          src={logo || ""}
                          className="img-fluid cp-user-logo-large"
                          alt=""
                        />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                  <nav className="main-menu">
                    <ul>
                      {navbar?.trade?.status && (
                        <li
                          className={
                            router.pathname == "/exchange/dashboard"
                              ? "cp-user-active-page"
                              : ""
                          }
                        >
                          <Link
                            href={
                              router.locale !== "en"
                                ? `/${router.locale}/exchange/dashboard`
                                : "/exchange/dashboard"
                            }
                          >
                            <a
                              className="arrow-icon"
                              href="#"
                              aria-expanded="true"
                            >
                              <span className="cp-user-icon">
                                <BsBarChartLine />
                              </span>
                              <span className="cp-user-name">
                                {navbar?.trade?.name
                                  ? navbar?.trade?.name
                                  : t("Exchange")}
                              </span>
                            </a>
                          </Link>
                          <ul className="">
                            {navbar?.trade?.status && (
                              <Link
                                href={
                                  router.locale !== "en"
                                    ? `/${router.locale}/exchange/dashboard`
                                    : "/exchange/dashboard"
                                }
                              >
                                <li>
                                  <a href="">{t("Spot Trading")}</a>
                                </li>
                              </Link>
                            )}
                            {parseInt(settings?.p2p_module) === 1 && (
                              <Link href={isLoggedIn ? "/p2p" : "/signin"}>
                                <li
                                  className={
                                    router.pathname == "/p2p"
                                      ? "cp-user-active-page"
                                      : ""
                                  }
                                >
                                  <a href="">{t("P2P Trading")}</a>
                                </li>
                              </Link>
                            )}
                          </ul>
                        </li>
                      )}
                      {navbar?.wallet?.status && (
                        <Link
                          href={
                            isLoggedIn === true ? "/user/my-wallet" : "/signin"
                          }
                        >
                          <li
                            className={
                              router.pathname == "/user/my-wallet"
                                ? "cp-user-active-page"
                                : router.pathname == "/user/swap-coin"
                                ? "cp-user-active-page"
                                : ""
                            }
                          >
                            <a href="">
                              <span className="cp-user-icon">
                                <BiWalletAlt />
                              </span>
                              <span className="cp-user-name">
                                {navbar?.wallet?.name
                                  ? navbar?.wallet?.name
                                  : t("Backtesting")}
                              </span>
                            </a>
                          </li>
                        </Link>
                      )}
                      {parseInt(settings.launchpad_settings) === 1 &&
                        navbar?.ico?.status && (
                          <Link href={isLoggedIn ? "/ico" : "/signin"}>
                            <li
                              className={
                                router.pathname == "/ico"
                                  ? "cp-user-active-page"
                                  : ""
                              }
                            >
                              <a href="">
                                <span className="cp-user-icon">
                                  <RiCalendarEventLine />
                                </span>
                                <span className="cp-user-name">
                                  {navbar?.ico?.name
                                    ? navbar?.ico?.name
                                    : t("ICO")}
                                </span>
                              </a>
                            </li>
                          </Link>
                        )}
                      
                      {parseInt(settings.currency_deposit_status) === 1 &&
                        navbar?.fiat?.status && (
                          <li
                            className={
                              router.pathname == "/fiat-deposit"
                                ? "cp-user-active-page"
                                : router.pathname == "/fiat-withdrawal"
                                ? "cp-user-active-page"
                                : ""
                            }
                          >
                            <Link
                              href={
                                isLoggedIn === true
                                  ? "/fiat-deposit"
                                  : "/signin"
                              }
                            >
                              <a
                                className="arrow-icon"
                                href="#"
                                aria-expanded="true"
                              >
                                <span className="cp-user-icon">
                                  <FiSettings />
                                </span>
                                <span className="cp-user-name">
                                  {navbar?.fiat?.name
                                    ? navbar?.fiat?.name
                                    : t("Fiat")}
                                </span>
                              </a>
                            </Link>
                            <ul>
                              {navbar?.fiat?.deposit?.status && (
                                <Link
                                  href={
                                    isLoggedIn ? "/fiat-deposit" : "/signin"
                                  }
                                >
                                  <li>
                                    <a href="">
                                      {navbar?.fiat?.deposit.name
                                        ? navbar?.fiat?.deposit.name
                                        : t("Deposit")}
                                    </a>
                                  </li>
                                </Link>
                              )}
                              {navbar?.fiat?.withdrawal?.status && (
                                <Link
                                  href={
                                    isLoggedIn ? "/fiat-withdrawal" : "/signin"
                                  }
                                >
                                  <li
                                    className={
                                      router.pathname == "/fiat-withdrawal"
                                        ? "cp-user-active-page"
                                        : ""
                                    }
                                  >
                                    <a href="">
                                      {navbar?.fiat?.withdrawal.name
                                        ? navbar?.fiat?.withdrawal.name
                                        : t("Withdrawal")}
                                    </a>
                                  </li>
                                </Link>
                              )}
                            </ul>
                          </li>
                        )}
                      <li
                      // className={
                      //   router.pathname == "/user/wallet-history"
                      //     ? "cp-user-active-page"
                      //     : router.pathname == "/user/swap-history"
                      //     ? "cp-user-active-page"
                      //     : router.pathname == "/user/buy-order-history"
                      //     ? "cp-user-active-page"
                      //     : router.pathname == "/user/sell-order-history"
                      //     ? "cp-user-active-page"
                      //     : router.pathname == "/user/transaction-history"
                      //     ? "cp-user-active-page"
                      //     : router.pathname ==
                      //       "/user/currency-deposit-history"
                      //     ? "cp-user-active-page"
                      //     : ""
                      // }
                      >
                        {navbar?.reports?.status && (
                          <Link
                            href={
                              isLoggedIn
                                ? "/user/wallet-history?type=deposit"
                                : "/signin"
                            }
                          >
                            <a
                              className="arrow-icon"
                              href="#"
                              aria-expanded="true"
                            >
                              <span className="cp-user-icon">
                                <HiOutlineDocumentReport />
                              </span>
                              <span className="cp-user-name">
                                {navbar?.reports?.name
                                  ? navbar?.reports?.name
                                  : t("Reports")}
                              </span>
                            </a>
                          </Link>
                        )}

                        <ul className="">
                          {navbar?.reports?.depositHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/wallet-history?type=deposit"
                                  : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname ==
                                  "/user/wallet-history?type=deposit"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.depositHistory?.name
                                    ? navbar?.reports?.depositHistory?.name
                                    : t("Deposit History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.withdrawalHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/wallet-history?type=withdrawal"
                                  : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname ==
                                  "/user/wallet-history?type=withdrawal"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.withdrawalHistory?.name
                                    ? navbar?.reports?.withdrawalHistory?.name
                                    : t("Withdrawal History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.swapHistory?.status && (
                            <Link
                              href={
                                isLoggedIn ? "/user/swap-history" : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname == "/user/swap-history"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.swapHistory?.name
                                    ? navbar?.reports?.swapHistory?.name
                                    : t("Swap History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.buyOrderHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/buy-order-history"
                                  : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname == "/user/buy-order-history"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.buyOrderHistory?.name
                                    ? navbar?.reports?.buyOrderHistory?.name
                                    : t("Buy Order History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.sellOrderHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/sell-order-history"
                                  : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname == "/user/sell-order-history"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.sellOrderHistory?.name
                                    ? navbar?.reports?.sellOrderHistory?.name
                                    : t("Sell Order History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.transactionHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/transaction-history"
                                  : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname == "/user/transaction-history"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.transactionHistory?.name
                                    ? navbar?.reports?.transactionHistory?.name
                                    : t("Transaction History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.fiatDepositHistory?.status &&
                            parseInt(settings.currency_deposit_status) ===
                              1 && (
                              <Link
                                href={
                                  isLoggedIn
                                    ? "/user/currency-deposit-history"
                                    : "/signin"
                                }
                              >
                                <li
                                  className={
                                    router.pathname ==
                                    "/user/currency-deposit-history"
                                      ? "cp-user-active-page"
                                      : ""
                                  }
                                >
                                  <a href="">
                                    {navbar?.reports?.fiatDepositHistory?.name
                                      ? navbar?.reports?.fiatDepositHistory
                                          ?.name
                                      : t("Fiat Deposit History")}
                                  </a>
                                </li>
                              </Link>
                            )}
                          <Link
                            href={
                              isLoggedIn
                                ? "/user/stop-limit-order-history"
                                : "/signin"
                            }
                          >
                            <li
                              className={
                                router.pathname ==
                                "/user/stop-limit-order-history"
                                  ? "cp-user-active-page"
                                  : ""
                              }
                            >
                              <a href="">{t("Stop Limit History")}</a>
                            </li>
                          </Link>
                          <Link
                            href={
                              isLoggedIn
                                ? "/user/referral-earning-withdrawal/" +
                                  REFERRAL_TYPE_DEPOSIT
                                : "/signin"
                            }
                          >
                            <li
                              className={
                                router.pathname ==
                                "/user/referral-earning-withdrawal/" +
                                  REFERRAL_TYPE_DEPOSIT
                                  ? "cp-user-active-page"
                                  : ""
                              }
                            >
                              <a href="">
                                {t("Referral earning from withdrawal")}
                              </a>
                            </li>
                          </Link>
                          <Link
                            href={
                              isLoggedIn
                                ? "/user/referral-earning-trade/" +
                                  REFERRAL_TYPE_TRADE
                                : "/signin"
                            }
                          >
                            <li
                              className={
                                router.pathname ==
                                "/user/referral-earning-trade/" +
                                  REFERRAL_TYPE_TRADE
                                  ? "cp-user-active-page"
                                  : ""
                              }
                            >
                              <a href="">{t("Referral earning from trade")}</a>
                            </li>
                          </Link>
                          {navbar?.reports?.fiatWithdrawalHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/currency-withdraw-history"
                                  : "/signin"
                              }
                            >
                              <li
                                className={
                                  router.pathname ==
                                  "/user/currency-withdraw-history"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.reports?.fiatWithdrawalHistory?.name
                                    ? navbar?.reports?.fiatWithdrawalHistory
                                        ?.name
                                    : t("Fiat Withdrawal History")}
                                </a>
                              </li>
                            </Link>
                          )}
                        </ul>
                      </li>
                      {navbar?.myProfile?.status && (
                        <Link href={isLoggedIn ? "/user/profile" : "/signin"}>
                          <li
                            className={
                              router.pathname == "/user/profile"
                                ? "cp-user-active-page"
                                : ""
                            }
                          >
                            <a href="">
                              <span className="cp-user-icon">
                                <CgProfile />
                              </span>
                              <span className="cp-user-name">
                                {navbar?.myProfile?.name
                                  ? navbar?.myProfile?.name
                                  : t("My Profile")}
                              </span>
                            </a>
                          </li>
                        </Link>
                      )}
                      <Link href={isLoggedIn ? "/user/referral" : "/signin"}>
                        <li
                          className={
                            router.pathname == "/user/referral"
                              ? "cp-user-active-page"
                              : ""
                          }
                        >
                          {navbar?.myReferral?.status && (
                            <Link href="/user/referral">
                              <a>
                                <span className="cp-user-icon">
                                  <BiNetworkChart />
                                </span>
                                <span className="cp-user-name">
                                  {navbar?.myReferral?.name
                                    ? navbar.myReferral?.name
                                    : t("My Referral")}
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </Link>
                      <li
                        className={
                          router.pathname == "/user/settings"
                            ? "cp-user-active-page"
                            : router.pathname == "/user/faq"
                            ? "cp-user-active-page"
                            : ""
                        }
                      >
                        {navbar?.settings?.status && (
                          <Link
                            href={isLoggedIn ? "/user/settings" : "/signin"}
                          >
                            <a
                              className="arrow-icon"
                              href="#"
                              aria-expanded="true"
                            >
                              <span className="cp-user-icon">
                                <FiSettings />
                              </span>
                              <span className="cp-user-name">
                                {navbar?.settings?.name
                                  ? navbar?.settings?.name
                                  : t("Settings")}
                              </span>
                            </a>
                          </Link>
                        )}

                        <ul className="">
                          {navbar?.settings?.mySettings?.status && (
                            <Link
                              href={isLoggedIn ? "/user/settings" : "/signin"}
                            >
                              <li>
                                <a href="">
                                  {navbar?.settings?.mySettings?.name
                                    ? navbar?.settings?.mySettings?.name
                                    : t("My Settings")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.settings?.faq?.status && (
                            <Link href={isLoggedIn ? "/user/faq" : "/signin"}>
                              <li
                                className={
                                  router.pathname == "/user/faq"
                                    ? "cp-user-active-page"
                                    : ""
                                }
                              >
                                <a href="">
                                  {navbar?.settings?.faq?.name
                                    ? navbar?.settings?.faq?.name
                                    : t("FAQ")}
                                </a>
                              </li>
                            </Link>
                          )}
                        </ul>
                      </li>
                      <li>
                        <a className="arrow-icon" href="#" aria-expanded="true">
                          <span className="cp-user-icon">
                            <IoMdGlobe size={20} />
                          </span>
                          <span className="cp-user-name">
                            {router.locale?.toLocaleUpperCase()}
                          </span>
                        </a>
                        <ul className="">
                          {settings?.LanguageList?.map(
                            (item: any, index: any) => (
                              <li key={index}>
                                <Link href={router.asPath} locale={item.key}>
                                  <a className="py-1">{item.name}</a>
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>

                <NotificationDropdown
                  isLoggedIn={isLoggedIn}
                  notificationData={notificationData}
                  seen={seen}
                  user={user}
                  theme={theme}
                  settings={settings}
                  setTheme={setTheme}
                  setActive={setActive}
                  active={active}
                />
              </div>
            </div>
          </div>

          <OutsideClickHandler onOutsideClick={() => setActive(false)}>
            <div className={`cp-user-sidebar ${active ? "active" : ""}`}>
              <div
                onClick={() => setActive(false)}
                className="cp-user-sidebar-menu scrollbar-inner"
              >
                <nav>
                  <ul id="metismenu">
                    {navbar?.trade?.status && (
                      <li className=" cp-user-active-page ">
                        <a
                          href={
                            router.locale !== "en"
                              ? `/${router.locale}/exchange/dashboard`
                              : "/exchange/dashboard"
                          }
                        >
                          <span className="cp-user-icon">
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon"
                              alt=""
                            />
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon-hover"
                              alt=""
                            />
                          </span>
                          <span className="cp-user-name">
                            {navbar?.trade?.name
                              ? navbar?.trade?.name
                              : t("Trade")}
                          </span>
                        </a>
                      </li>
                    )}
                    <li>
                      {/* <a className="arrow-icon" href="#" aria-expanded="true">
                        <span className="cp-user-icon">
                          <img
                            src=""
                            className="img-fluid cp-user-side-bar-icon"
                            alt=""
                          />
                          <img
                            src=""
                            className="img-fluid cp-user-side-bar-icon-hover"
                            alt=""
                          />
                        </span>
                        <span className="cp-user-name">{t("Wallet")}</span>
                      </a> */}
                      <ul>
                        {navbar?.wallet?.status && (
                          <Link
                            href={isLoggedIn ? "/user/my-wallet" : "/signin"}
                          >
                            <li>
                              <a href="">
                                {navbar?.wallet?.name
                                  ? navbar?.wallet?.name
                                  : t("Wallet")}
                              </a>
                            </li>
                          </Link>
                        )}
                        {parseInt(settings.currency_deposit_status) === 1 &&
                          navbar?.fiat?.status && (
                            <Link
                              href={isLoggedIn ? "/fiat-deposit" : "/signin"}
                            >
                              <li>
                                <a href="">{t("Fiat Deposit")}</a>
                              </li>
                            </Link>
                          )}
                        {parseInt(settings.currency_deposit_status) === 1 &&
                          navbar?.fiat?.status && (
                            <Link
                              href={isLoggedIn ? "/fiat-withdrawal" : "/signin"}
                            >
                              <li>
                                <a href="">{t("Fiat Withdrawal")}</a>
                              </li>
                            </Link>
                          )}
                      </ul>
                    </li>
                    {navbar?.reports?.status && (
                      <li>
                        <a className="arrow-icon" href="#" aria-expanded="true">
                          <span className="cp-user-icon">
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon"
                              alt=""
                            />
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon-hover"
                              alt=""
                            />
                          </span>
                          <span className="cp-user-name">
                            {navbar?.reports?.name
                              ? navbar?.reports?.name
                              : t("Reports")}
                          </span>
                        </a>
                        <ul>
                          {navbar?.reports?.depositHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/wallet-history?type=deposit"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.depositHistory?.name
                                    ? navbar?.reports?.depositHistory?.name
                                    : t("Deposit History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.withdrawalHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/wallet-history?type=withdrawal"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.withdrawalHistory?.name
                                    ? navbar?.reports?.withdrawalHistory?.name
                                    : t("Withdrawal History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.swapHistory?.status && (
                            <Link
                              href={
                                isLoggedIn ? "/user/swap-history" : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.swapHistory?.name
                                    ? navbar?.reports?.swapHistory?.name
                                    : t("Swap History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.buyOrderHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/buy-order-history"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {" "}
                                  {navbar?.reports?.buyOrderHistory?.name
                                    ? navbar?.reports?.buyOrderHistory?.name
                                    : t("Buy Order History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.sellOrderHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/sell-order-history"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.sellOrderHistory?.name
                                    ? navbar?.reports?.sellOrderHistory?.name
                                    : t("Sell Order History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.transactionHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/transaction-history"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.transactionHistory?.name
                                    ? navbar?.reports?.transactionHistory?.name
                                    : t("Transaction History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.fiatDepositHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/currency-withdraw-history"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.fiatDepositHistory?.name
                                    ? navbar?.reports?.fiatDepositHistory?.name
                                    : t("Fiat Deposit History")}
                                </a>
                              </li>
                            </Link>
                          )}
                          {navbar?.reports?.fiatWithdrawalHistory?.status && (
                            <Link
                              href={
                                isLoggedIn
                                  ? "/user/currency-withdraw-history"
                                  : "/signin"
                              }
                            >
                              <li>
                                <a href="">
                                  {navbar?.reports?.fiatWithdrawalHistory?.name
                                    ? navbar?.reports?.fiatWithdrawalHistory
                                        ?.name
                                    : t("Fiat Withdrawal History")}
                                </a>
                              </li>
                            </Link>
                          )}
                        </ul>
                      </li>
                    )}
                    <li>
                      <ul>
                        {navbar?.myProfile?.status && (
                          <Link href={isLoggedIn ? "/user/profile" : "/signin"}>
                            <li>
                              <a href="">
                                {navbar?.myProfile?.name
                                  ? navbar?.myProfile?.name
                                  : t("My Profile")}
                              </a>
                            </li>
                          </Link>
                        )}
                      </ul>
                    </li>{" "}
                    <li>
                      <ul>
                        <Link
                          href={isLoggedIn ? "/user/edit-profile" : "/signin"}
                        >
                          <li>
                            <a href="">{t("Edit Profile")}</a>
                          </li>
                        </Link>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <Link
                          href={
                            isLoggedIn ? "/user/phone-verification" : "/signin"
                          }
                        >
                          <li>
                            <a href="">{t("Phone Verification")}</a>
                          </li>
                        </Link>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <Link href={isLoggedIn ? "/user/security" : "/signin"}>
                          <li>
                            <a href="">{t("Security")}</a>
                          </li>
                        </Link>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <Link
                          href={
                            isLoggedIn
                              ? "/user/personal-verification"
                              : "/signin"
                          }
                        >
                          <li>
                            <a href="">{t("KYC Verification")}</a>
                          </li>
                        </Link>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <Link href={isLoggedIn ? "/user/bank/list" : "/signin"}>
                          <li>
                            <a href="">{t("Bank List")}</a>
                          </li>
                        </Link>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <Link
                          href={
                            isLoggedIn ? "/user/change-password" : "/signin"
                          }
                        >
                          <li>
                            <a href="">{t("Change Password")}</a>
                          </li>
                        </Link>
                      </ul>
                    </li>
                    {/* /user/change-password */}
                    <li>
                      <Link href="/user/referral">
                        <a>
                          <span className="cp-user-icon">
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon"
                              alt=""
                            />
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon-hover"
                              alt=""
                            />
                          </span>
                          {navbar?.myReferral?.status && (
                            <span className="cp-user-name">
                              {navbar?.myReferral?.name
                                ? navbar.myReferral?.name
                                : t("My Referral")}
                            </span>
                          )}
                        </a>
                      </Link>
                    </li>
                    <li>
                      {navbar?.settings?.ststus && (
                        <a className="arrow-icon" href="#" aria-expanded="true">
                          <span className="cp-user-icon">
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon"
                              alt=""
                            />
                            <img
                              src=""
                              className="img-fluid cp-user-side-bar-icon-hover"
                              alt=""
                            />
                          </span>
                          <span className="cp-user-name">
                            {navbar?.settings?.name
                              ? navbar?.settings?.name
                              : t("Settings")}
                          </span>
                        </a>
                      )}
                      <ul>
                        {navbar?.settings?.mySettings?.status && (
                          <Link
                            href={isLoggedIn ? "/user/settings" : "/signin"}
                          >
                            <li>
                              <a href="">
                                {navbar?.settings?.mySettings?.name
                                  ? navbar?.settings?.mySettings?.name
                                  : t("My Settings")}
                              </a>
                            </li>
                          </Link>
                        )}
                        {navbar?.settings?.faq?.status && (
                          <Link href={isLoggedIn ? "/user/faq" : "/signin"}>
                            <li>
                              <a href="">
                                {navbar?.settings?.faq?.name
                                  ? navbar?.settings?.faq?.name
                                  : t("FAQ")}
                              </a>
                            </li>
                          </Link>
                        )}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </OutsideClickHandler>
        </>
      ) : !isLoggedIn && isLoading === false ? (
        <UnAuthNav logo={logo} />
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;
