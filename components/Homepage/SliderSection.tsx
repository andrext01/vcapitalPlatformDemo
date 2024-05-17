import ImageComponent from "components/common/ImageComponent";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
import { TfiAnnouncement } from "react-icons/tfi";
const SliderSection = ({
  bannerListdata,
  landing,
  announcementListdata,
}: any) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    className: "center",
    slidesToShow: bannerListdata.length < 4 ? 1 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      {bannerListdata.length > 0 &&
        parseInt(landing?.landing_second_section_status) === 1 && (
          <section className="about-area">
            <div className="container">
              <Slider {...settings}>
                {bannerListdata?.map((item: any, index: number) => (
                  <Link href={`/banner/${item.slug}`} key={index}>
                    <div className="single-banner">
                      {/* <img
                        src={item.image}
                        alt="about-image-phone"
                        className="slider-image-class"
                      /> */}
                      <ImageComponent src={item.image} height={300} />
                    </div>
                  </Link>
                ))}
              </Slider>
              <div className="about-info">
                {announcementListdata?.map((item: any, index: number) => (
                  <div className="single-info" key={index}>
                    <p>
                      <TfiAnnouncement />
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
    </div>
  );
};

export default SliderSection;
