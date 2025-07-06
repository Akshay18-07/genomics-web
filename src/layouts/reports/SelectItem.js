import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "./data/authorsTableData";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MDButton from "components/MDButton";

function CasesList() {
  const user = useSelector((state) => state.login);
  const { reportId } = useParams();
  const { columns, rows } = authorsTableData(reportId);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.reportId) {
        navigate(`/reports/${e.detail.reportId}/detail/${e.detail.reportId}`);
      }
    };
    window.addEventListener("navigate-to-item-detail", handler);
    return () => window.removeEventListener("navigate-to-item-detail", handler);
  }, [navigate]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Reports
                </MDTypography>
                {user?.product == "Onquer" && (
                  <MDButton
                    color={"info"}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      window.location.href = `/summary/${reportId}`;
                    }}
                  >
                    View Summary
                  </MDButton>
                )}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default CasesList;
