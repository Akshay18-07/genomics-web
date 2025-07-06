import React from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import MDBox from "components/MDBox";
import Card from "@mui/material/Card";

import ExcelLikeTable from "./TableData";

function ViewSummary() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox pt={3} style={{ width: "100%", height: "100%" }}>
            <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
              <ExcelLikeTable />
            </div>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default ViewSummary;
