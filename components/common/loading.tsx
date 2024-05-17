import useTranslation from "next-translate/useTranslation";
import React from "react";

const Loading = () => {
  const { t } = useTranslation("common");
  return (
    <div className="preloder-area">
      <span className="loader"></span>
    </div>
  );
};

export default Loading;
