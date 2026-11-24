import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import HeritageBanner from "./heritage/HeritageBanner";
import palace from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";

const ConcoursCTASection = () => {
  const { t } = useTranslation();
  return (
    <HeritageBanner
      image={palace}
      icon={Trophy}
      title={t("concours.home_cta_title")}
      desc={t("concours.home_cta_desc")}
      to="/concours"
      cta={t("concours.home_cta_button")}
    />
  );
};

export default ConcoursCTASection;
