import { checkThemeState, darkModeToggle } from "helpers/functions";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { IoMdGlobe } from "react-icons/io";
import { IoLanguageSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const UnAuthNav = ({ logo }: any) => {
  const [theme, setTheme] = useState(0);
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);
  const router = useRouter();
  useEffect(() => {
    checkThemeState(setTheme);
  }, []);
  return (
    <header className="header-area shadow-sm">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-2">
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
          <div className="col-md-10">
            <div className="menu-area text-right">
              <nav className="main-menu mobile-menu">
                <ul id="nav">
                  <li>
                    <a className="flex" href="#" aria-expanded="true">
                      <span className="ml-2">{t("Exchange")}</span>
                    </a>
                    <ul className="lang-list">
                      <li>
                        <Link href="/exchange/dashboard">
                          <a className="py-1">{t("Spot Trading")}</a>
                        </Link>
                      </li>
                      {parseInt(settings?.p2p_module) === 1 && (
                        <li>
                          <Link href="/p2p">
                            <a className="py-1">{t("P2P Trading")}</a>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                  <li>
                    <Link href="/signin">{t("Login")}</Link>
                  </li>
                  <li>
                    <Link href="/signup">{t("Sign up")}</Link>
                  </li>
                  <li
                    onClick={() => {
                      darkModeToggle(settings, setTheme);
                    }}
                  >
                    <a href="">
                      {theme === 0 ? (
                        <>
                          <BsFillSunFill size={20} className="mr-2" />
                          {t("Light")}
                        </>
                      ) : (
                        <>
                          <BsFillMoonFill size={14} className="mr-2" />
                          {t("Dark")}
                        </>
                      )}
                    </a>
                  </li>
                  <li>
                    <a className="flex" href="#" aria-expanded="true">
                      <IoMdGlobe size={20} />

                      <span className="ml-2">
                        {router.locale?.toLocaleUpperCase()}
                      </span>
                    </a>
                    <ul className="lang-list">
                      {settings?.LanguageList?.map((item: any, index: any) => (
                        <li key={index}>
                          <Link href={router.asPath} locale={item.key}>
                            <a className="py-1">{item.name}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnAuthNav;
