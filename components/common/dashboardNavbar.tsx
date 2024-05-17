import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { BsBarChartLine, BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { BiNetworkChart } from "react-icons/bi";
import { IoLanguageSharp } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { HiArrowNarrowRight, HiOutlineDocumentReport } from "react-icons/hi";
import { BiWalletAlt } from "react-icons/bi";
import OutsideClickHandler from "react-outside-click-handler";
import {
  RiCalendarEventLine,
  RiNotificationBadgeLine,
  RiWallet3Line,
} from "react-icons/ri";
import { RootState } from "state/store";
import { LogoutAction } from "state/actions/user";
import useTranslation from "next-translate/useTranslation";
import { notification, notificationSeen } from "service/notification";
import { LanguageList } from "helpers/lang";
import { useRouter } from "next/router";
import moment from "moment";
import { checkThemeState, darkModeToggleDashboard } from "helpers/functions";
import { IoMdGlobe } from "react-icons/io";
import {getBalance} from '../exchange/marketApi/balanceApi';
import {
  REFERRAL_TYPE_DEPOSIT,
  REFERRAL_TYPE_TRADE,
} from "helpers/core-constants";
const DashboardNavbar = () => {
  const { isLoggedIn, user, logo } = useSelector(
    (state: RootState) => state.user
  );
  const router = useRouter();
  const [theme, setTheme] = useState(0);
  const { settings } = useSelector((state: RootState) => state.common);
  const { navbar } = settings;
  // let balanceAmount = 0;

  const [balanceAmount, setBalanceAmount] = useState(0);
  const [active, setActive] = useState(false);
  const [notificationData, setNotification] = useState<any>([]);
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const getNotifications = async () => {
    const data = await notification();
    setNotification(data.data.data);
  };
  const seen = async () => {
    let arr: any = [];
    notificationData.map((notification: any) => {
      arr.push(notification.id);
    });
    notificationSeen(arr).then((data: any) => {
      setNotification([]);
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
  useEffect(() => {
    const getBalanceFunction = async () => {
      const input = document.getElementById('balance_id') as HTMLButtonElement;
      const genInput = document.getElementById('general_balance_id') as HTMLButtonElement;
      let inputValue = 0;
      let width = 0;
      const balance = await getBalance();
      if(balance.status) {
        setBalanceAmount(balance.data[0].balance);
        input.value = balance.data[0].balance;
        genInput.value = balance.data[0].balance;
        width = input.value.length * 7;
        inputValue = input ? parseFloat(input.value) : 0;
        localStorage.setItem('balance', JSON.stringify(balance.data[0]));
      } else {
        alert('Error al obtener el balance, por favor refrescar la página o ponerse en contacto con el equipo de soporte');
      }
      input.style.width = `${width}px`;
      genInput.style.width = `${width}px`;
    }
    getBalanceFunction();
  }, []);
  function LineBreak() {
    return <br />;
  }
  return (
    <>
      <div className="cp-user-top-bar dark-board">
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
            { 1 ? (<div className="col-xl-8 col-lg-8 col-8 justify-content-center d-flex flex-row" style={{fontSize: "11px"}}>
                <div className="mr-3">
                    <span>Balance Proyectado</span>
                    <LineBreak />
                    <input className="balance-amount" id="balance_id" type="number" style={{
                          backgroundColor:" transparent",
                          border: "none !important",
                          outline: "none",
                          color: "white",
                          width: "15px"
                        }} readOnly/>
                    <span>USD</span>
                </div>
                <div>
                    <span>Balance General</span>
                  <LineBreak />
                    <input className="balance-amount" id="general_balance_id" type="number" style={{
                          backgroundColor:" transparent",
                          border: "none !important",
                          outline: "none",
                          color: "white",
                          width: "15px"
                        }}
                        readOnly/>
                    <span>USD</span>
                </div>
            </div>) : (
              <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                <nav className="main-menu">
                  
                </nav>
              </div>
            )}

            <div className="col-xl-2 col-lg-2 col-8">
              {isLoggedIn ? (
                <div className="cp-user-top-bar-right">
                  <OutsideClickHandler onOutsideClick={() => setActive(false)}>
                    <div>
                      <ul>
                        <li className="hm-notify" id="notification_item">
                          <div className="btn-group dropdown">
                            <button
                              type="button"
                              className="btn notification-btn dropdown-toggle"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span
                                className="notify-value hm-notify-number"
                                onClick={() => {}}
                              >
                                {notificationData?.length > 100
                                  ? "99+"
                                  : notificationData?.length}
                              </span>
                              <img
                                src="/notification.png"
                                className="img-fluid"
                                alt=""
                              />
                            </button>
                            <div className="dropdown-menu notification-list dropdown-menu-right dark-trade-notify">
                              <div className="notify-menu">
                                <div className="notification-list-title">
                                  <div className="notify-counter">
                                    <div className="notify-pending">
                                      <p>
                                        <span>{notificationData.length}</span>{" "}
                                        {t("pending notifications")}
                                      </p>
                                      <a
                                        onClick={() => {
                                          seen();
                                        }}
                                        className="clear-all"
                                        href="#"
                                      >
                                        {t("Clear All")}
                                      </a>
                                    </div>

                                    <div className="notifiy-clear">
                                      <Link href="/user/notification">
                                        <a
                                          // onClick={() => {
                                          //   seen();
                                          // }}
                                          className="view-all"
                                        >
                                          {t("View All")}
                                        </a>
                                      </Link>
                                      <HiArrowNarrowRight />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="notify-grid-item">
                                    {notificationData.length > 0 ? (
                                      notificationData
                                        ?.slice(0, 5)
                                        ?.map((item: any, index: number) => (
                                          <div
                                            className="notify-icon-title"
                                            key={index}
                                          >
                                            <RiNotificationBadgeLine
                                              size={20}
                                              className="notify-menu-icon"
                                            />
                                            <div>
                                              <h6>
                                                {item?.title.substring(0, 40)}
                                              </h6>
                                              <p>
                                                {item?.notification_body.substring(
                                                  0,
                                                  50
                                                )}
                                              </p>
                                              <span>
                                                {moment(
                                                  item?.created_at
                                                ).format("DD MMM YYYY")}
                                              </span>
                                            </div>
                                          </div>
                                        ))
                                    ) : (
                                      <p className="notFountNotifyText">
                                        {t("No Notification Found!")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li className="hm-notify" id="notification_item">
                          <div className="btn-group profile-dropdown">
                            <button
                              type="button"
                              className="btn dropdown-toggle"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="cp-user-avater">
                                <span
                                  className={`${
                                    user?.online_status?.online_status
                                      ? "tradeUserActive"
                                      : "tradeUserDeactive"
                                  } cp-user-img`}
                                >
                                  {user?.photo && (
                                    <img
                                      src={user?.photo}
                                      className="img-fluid"
                                      alt="user"
                                    />
                                  )}
                                </span>
                                <span className="cp-user-avater-info"></span>
                              </span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right">
                              <span
                                className={`${
                                  user?.online_status?.online_status
                                    ? "userActive"
                                    : "userDeactive"
                                } big-user-thumb`}
                              >
                                <img
                                  src={user?.photo}
                                  className="img-fluid"
                                  alt=""
                                />
                              </span>
                              <div className="user-name">
                                <p className="nav-userName">
                                  {user?.first_name!} {user?.last_name!}
                                </p>
                              </div>
                              <Link href="/user/profile">
                                <button className="dropdown-item" type="button">
                                  <a href="">
                                    <i className="fa-regular fa-user"></i>{" "}
                                    {t("Profile")}
                                  </a>
                                </button>
                              </Link>
                              <Link href="/user/settings">
                                <button className="dropdown-item" type="button">
                                  <a href="">
                                    <i className="fa fa-cog"></i>{" "}
                                    {t("My Settings")}
                                  </a>
                                </button>
                              </Link>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={async () => {
                                  router.reload();
                                  darkModeToggleDashboard();
                                }}
                              >
                                <a href="#">
                                  {theme === 0 ? (
                                    <>
                                      <BsFillSunFill
                                        size={26}
                                        className="mr-2"
                                      />
                                      {t("Light")}
                                    </>
                                  ) : (
                                    <>
                                      <BsFillMoonFill
                                        size={20}
                                        className="mr-2"
                                      />
                                      {t("Dark")}
                                    </>
                                  )}
                                </a>
                              </button>
                              <Link href="/user/my-wallet">
                                <button className="dropdown-item" type="button">
                                  <a href="-wallet">
                                    <i className="fa fa-credit-card"></i>{" "}
                                    {t("My Wallet")}
                                  </a>
                                </button>
                              </Link>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  dispatch(LogoutAction());
                                }}
                              >
                                <a>
                                  <i className="fa fa-sign-out"></i>{" "}
                                  {t("Logout")}
                                </a>
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </OutsideClickHandler>
                  <div
                    className="cp-user-sidebar-toggler-s2"
                    onClick={() => {
                      setActive(active ? false : true);
                    }}
                  >
                    <img src="/menu.svg" className="img-fluid" alt="" />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
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
                        {navbar?.trade?.name ? navbar?.trade?.name : t("Trade")}
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
                      <Link href={isLoggedIn ? "/user/my-wallet" : "/signin"}>
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
                        <Link href={isLoggedIn ? "/fiat-deposit" : "/signin"}>
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
                          href={isLoggedIn ? "/user/swap-history" : "/signin"}
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
                            isLoggedIn ? "/user/buy-order-history" : "/signin"
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
                            isLoggedIn ? "/user/sell-order-history" : "/signin"
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
                            isLoggedIn ? "/user/transaction-history" : "/signin"
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
                                ? navbar?.reports?.fiatWithdrawalHistory?.name
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
                    <Link href={isLoggedIn ? "/user/edit-profile" : "/signin"}>
                      <li>
                        <a href="">{t("Edit Profile")}</a>
                      </li>
                    </Link>
                  </ul>
                </li>
                <li>
                  <ul>
                    <Link
                      href={isLoggedIn ? "/user/phone-verification" : "/signin"}
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
                        isLoggedIn ? "/user/personal-verification" : "/signin"
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
                      href={isLoggedIn ? "/user/change-password" : "/signin"}
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
                      <Link href={isLoggedIn ? "/user/settings" : "/signin"}>
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
  );
};

export default DashboardNavbar;
