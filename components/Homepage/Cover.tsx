import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Slider from "react-slick";

const Cover = ({ landing, loggedin, landing_banner_image }: any) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div>
      {parseInt(landing?.landing_first_section_status) === 1 && (
        <section className="hero-banner-area">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h1 className="banner-title">
                  {landing?.landing_title ||
                    t("Buy & Sell Instantly And Hold US stocks")}
                </h1>
                <p className="banner-content">
                  {landing?.landing_description ||
                    t(
                      "Vcapitalpro platform is such a marketplace where people can trade directly with demo account"
                    )}
                </p>
                {!loggedin && (
                  <a
                    href={
                      router.locale !== "en"
                        ? `/${router.locale}/signup`
                        : "/signup"
                    }
                    className="primary-btn"
                  >
                    {t("Register Now")}
                  </a>
                )}
              </div>
              <div className="col-md-6 " style={{display: "none"}}>
                <ImageComponent
                  src={
                    landing_banner_image ||
                    "/undraw_crypto_flowers_re_dyqo.svg.svg"
                  }
                  height={300}
                  
                />
              {loggedin && (
                <a className="primary-btn">{t("Trade Now")}</a>
              )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cover;
