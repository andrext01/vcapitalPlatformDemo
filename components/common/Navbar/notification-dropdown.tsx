import { darkModeToggle } from "helpers/functions";
import moment from "moment";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { LogoutAction } from "state/actions/user";

const NotificationDropdown = ({
  isLoggedIn,
  notificationData,
  seen,
  user,
  theme,
  settings,
  setTheme,
  setActive,
  active,
}: any) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  return (
    <div className="col-xl-2 col-lg-2 col-8">
      {isLoggedIn ? (
        <div className="cp-user-top-bar-right">
          <div>
            <ul>
              <li className="hm-notify" id="notification_item">
                <div className="btn-group dropdown">
                  <button
                    type="button"
                    className="notification-btn dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <span
                      className="notify-value hm-notify-number"
                      onClick={() => {}}>
                      {notificationData?.length > 100
                        ? "99+"
                        : notificationData?.length}
                    </span>
                    <img src="/notification.png" className="img-fluid" alt="" />
                  </button>
                  <div className="dropdown-menu notification-list dropdown-menu-right">
                    <div className="notify-menu">
                      <div className="notification-list-title">
                        <div className="notify-counter">
                          <div className="notify-pending">
                            <p>
                              <span>{notificationData.length}</span>
                              {t("pending notifications")}
                            </p>
                            <a
                              onClick={() => {
                                seen();
                              }}
                              className="clear-all"
                              href="#">
                              {t("Clear All")}
                            </a>
                          </div>

                          <div className="notifiy-clear">
                            <Link href="/user/notification">
                              <a className="view-all">{t("View All")}</a>
                            </Link>
                            <HiArrowNarrowRight />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="notify-grid-item">
                          {notificationData?.length > 0 ? (
                            notificationData
                              ?.slice(0, 5)
                              ?.map((item: any, index: number) => (
                                <div className="notify-icon-title" key={index}>
                                  <RiNotificationBadgeLine
                                    size={20}
                                    className="notify-menu-icon"
                                  />
                                  <div>
                                    <h6>{item.title.substring(0, 40)}</h6>
                                    <p>
                                      {item.notification_body.substring(0, 50)}
                                    </p>
                                    <span>
                                      {moment(item.created_at).format(
                                        "DD MMM YYYY"
                                      )}
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

                    <div
                      className="scroll-wrapper scrollbar-inner"
                      style={{
                        position: "relative",
                      }}>
                      <ul
                        className="scrollbar-inner scroll-content"
                        style={{
                          height: "auto",
                          marginBottom: "0px",
                          marginRight: "0px",
                          maxHeight: "0px",
                        }}></ul>
                      <div className="scroll-element scroll-x">
                        <div className="scroll-element_outer">
                          <div className="scroll-element_size"></div>
                          <div className="scroll-element_track"></div>
                          <div className="scroll-bar"></div>
                        </div>
                      </div>
                      <div className="scroll-element scroll-y">
                        <div className="scroll-element_outer">
                          <div className="scroll-element_size"></div>
                          <div className="scroll-element_track"></div>
                          <div className="scroll-bar"></div>
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
                    aria-expanded="false">
                    <span className="cp-user-avater">
                      <span
                        className={`${
                          user?.online_status?.online_status
                            ? "tradeUserActive"
                            : "tradeUserDeactive"
                        } cp-user-img`}>
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
                    <p
                      className={`${
                        user?.online_status?.online_status
                          ? "userActive"
                          : "userDeactive"
                      } big-user-thumb`}>
                      <img
                        src={user?.photo}
                        className="img-fluid profile-avatar"
                        alt=""
                      />
                    </p>
                    <div className="user-name">
                      <p className="nav-userName">
                        {user?.first_name!} {user?.last_name!}
                      </p>
                    </div>
                    <Link href="/user/profile">
                      <button className="dropdown-item" type="button">
                        <a href="">
                          <i className="fa-regular fa-user"></i>
                          {t("Profile")}
                        </a>
                      </button>
                    </Link>
                    <Link href="/user/settings">
                      <button className="dropdown-item" type="button">
                        <a href="">
                          <i className="fa fa-cog"></i>
                          {t("My Settings")}
                        </a>
                      </button>
                    </Link>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        darkModeToggle(settings, setTheme);
                      }}>
                      <a href="#">
                        {theme === 0 ? (
                          <>
                            <BsFillSunFill size={26} className="mr-2" />
                            {t("Light")}
                          </>
                        ) : (
                          <>
                            <BsFillMoonFill size={20} className="mr-2" />
                            {t("Dark")}
                          </>
                        )}
                      </a>
                    </button>

                    <Link href="/user/my-wallet">
                      <button className="dropdown-item" type="button">
                        <a href="-wallet">
                          <i className="fa fa-credit-card"></i>
                          {t("My Wallet")}
                        </a>
                      </button>
                    </Link>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        dispatch(LogoutAction());
                      }}>
                      <a>
                        <i className="fa fa-sign-out"></i> {t("Logout")}
                      </a>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div
            className="cp-user-sidebar-toggler-s2"
            onClick={() => {
              setActive(active ? false : true);
            }}>
            <img src="/menu.svg" className="img-fluid" alt="" />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationDropdown;
