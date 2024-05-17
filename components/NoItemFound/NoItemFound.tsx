import useTranslation from "next-translate/useTranslation";

export const NoItemFound = ({ message, width=200 }: any) => {
  const { t } = useTranslation("common");
  return (
    <div className="text-center my-5">
      <img width={width} className="mb-3" src="/../noItem.svg" alt="" />
      <h3>{message ? message : t("No Item Found")}</h3>
    </div>
  );
};
