import InBoxLoader from "@/components/InBoxLoader";
import React from "react";

function DashboardLoading() {
  return (
    <section className="grid grid-rows-1 h-full">
      <InBoxLoader />
    </section>
  );
}

export default DashboardLoading;
