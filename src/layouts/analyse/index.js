import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";

import ExcelLikeTable from "./TableData";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { Grid } from "@mui/material";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MDButton from "components/MDButton";

function PatientTable() {
  const { user } = useSelector((state) => state.login);
  const sampleData = useSelector((state) => state.files.files);
  const { reportId } = useParams();

  const [filesData, setFilesData] = useState({});

  useEffect(() => {
    if (sampleData && reportId) {
      sampleData.map((item) => {
        if (item.id == reportId) {
          setFilesData({ ...item });
          console.log("itennss", item);
        }
      });
    }
  }, [sampleData]);
  console.log(user);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
              Analysis
            </MDTypography>

            {/* {user?.role == "admin" && ( */}
            <MDButton
              color={"info"}
              variant="contained"
              size="small"
              onClick={() => {
                window.location.href = `/interpretation/${reportId}`;
              }}
            >
              Interpretation
            </MDButton>
            {/* )} */}
          </MDBox>
          <Card
            sx={{
              position: "relative",
              m: 3,
              px: 2,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
                <ProfileInfoCard
                  title="Patient Detail"
                  description=""
                  info={{
                    "Sample Id": filesData?.SampleName,
                    Age: filesData.age,
                    Gender: filesData.gender,
                    "Phenotype Details": filesData.phenotype,
                  }}
                  social={[]}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
            </Grid>
          </Card>
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

export default PatientTable;
