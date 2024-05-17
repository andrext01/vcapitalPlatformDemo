import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SectionLoading = () => {
  return (
    <div className="loadingContainer container">
      <span className="loader"></span>
    </div>
  );
};

export default SectionLoading;
