"use client";
import CardInfo from "@/components/brand/admin/dashboard/CardInfo";
import AuditCompletionTimelineChart from "@/components/brand/admin/quality-assurance/AuditCompletionTimelineChart";
import ChangeManagementEfficiencyChart from "@/components/brand/admin/quality-assurance/ChangeManagementEfficiencyChart";
import DepartmentalComplianceLevelsChart from "@/components/brand/admin/quality-assurance/DepartmentalComplianceLevelsChart";
import ProgressChart from "@/components/brand/admin/quality-assurance/ProgressChart";
import QualityMetrics from "@/components/brand/admin/quality-assurance/QualityMetrics";
import ResearchProcessComplianceChart from "@/components/brand/admin/quality-assurance/ResearchProcessComplianceChart";
import ResourceDistribution from "@/components/brand/admin/quality-assurance/ResourceDistribution";

// Add this directive at the top

export default function QualityAssurance() {
  return (
    <div>
      <h1 className="p-4 text-3xl font-semibold">Quality Assurance</h1>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-4">
        <CardInfo title="Quality Assurance Reviews Completed" value="25" />
        <CardInfo title="Department Compliance Rate" value="90%" />
        <CardInfo title="Pending Quality Assurance Reviews" value="5" />
        <CardInfo title="Average Quality Score" value="85%" />
        <CardInfo title="Change Implementation Success Rate" value="75%" />
        <CardInfo title="Administrative Process Improvement" value="10%" />
        <CardInfo title="Educational Outcome Improvements" value="8%" />
        {/* <CardInfo title="Faculty Participation in QA" value="80%" /> */}
        <CardInfo title="Research Process Quality" value="95%" />
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        <QualityMetrics />
        <ResourceDistribution />
        <ProgressChart />
        <DepartmentalComplianceLevelsChart />
        <AuditCompletionTimelineChart />
        <ChangeManagementEfficiencyChart />
        <ResearchProcessComplianceChart />
      </div>
    </div>
  );
}
