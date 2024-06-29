import GridPlaceholder from "@/components/dashboard/CardPlaceholder";
import React from "react";

function Spinner() {
  return (
    <div className="grid place-content-center h-screen">
      <GridPlaceholder length={6} />
    </div>
  );
}

export default Spinner;
