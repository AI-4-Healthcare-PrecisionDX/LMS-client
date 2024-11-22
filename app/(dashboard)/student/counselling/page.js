import CounselingSession from "../../../../components/brand/student/counselling/CounselingSession";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";

const items = [{ href: "/student", label: "Home" }, { label: "Counselling" }];

const ITEMS_TO_DISPLAY = 2;

const CounsellingPage = () => {
  return (
    <div>
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="flex justify-between w-full items-center p-2 ">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
        </div>
      </div>
      <CounselingSession />
    </div>
  );
};

export default CounsellingPage;
