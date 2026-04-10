import DashBoardContent from "../components/DashBoardContent";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/provider/AuthContext";

export default function DashBoard() {
    const { t } = useTranslation('dashboard');
   const name = useAuth().user?.FullName;
  return (
    <>
          

     <main className="px-4 sm:px-6 md:px-8 lg:px-12  py-4 md:py-5">
      <h1 className="text-3xl font-bold text-heading mb-6" >{t("welcome", { name })}</h1>
       <DashBoardContent/>
     </main>
    </>
  );
}
