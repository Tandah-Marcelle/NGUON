import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import HeritageBanner from "./heritage/HeritageBanner";
import ceremony from "@/assets/culture-ceremony1.jpg";

const VoteCTASection = () => {
  const { t } = useTranslation();
  return (
    <HeritageBanner
      image={ceremony}
      icon={Heart}
      title={t("vote.home_cta_title")}
      desc={t("vote.home_cta_desc")}
      to="/vote"
      cta={t("vote.home_cta_button")}
      side="right"
    />
  );
};

export default VoteCTASection;
