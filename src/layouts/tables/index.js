import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/tables/data/authorsTableData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Tables() {
  const files = useSelector((state) => state.files.files);
  const { columns, rows } = authorsTableData(files);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      console.log(e);
      if (e.detail && e.detail.reportId) {
        navigate(`/reports/${e.detail.reportId}/list`);
      }
    };
    window.addEventListener("navigate-to-select-item", handler);
    return () => window.removeEventListener("navigate-to-select-item", handler);
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
              >
                <MDTypography variant="h6" color="white">
                  Reports
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true} // Enable pagination
                  showTotalEntries={true} // Show total entries
                  pagination // Ensure pagination is enabled
                  pageSize={5} // Set the page size explicitly
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

export default Tables;
