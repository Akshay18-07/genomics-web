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
import { InterpretationData } from "./data/sheetData";
import MDButton from "components/MDButton";
import InheriGeneReport from "../../assets/pdfs/InheriGene_DemoReport.pdf";
import OnQuer_DemoReport from "../../assets/pdfs/OnQuer_DemoReport.pdf";

function InterpretationPage() {
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
  const getInterPretationObjet = () => {
    const data = {};
    InterpretationData.map((item) => {
      data[item?.["Gene Name"]] = item?.Interpretation;
    });

    return data;
  };
  const { product } = useSelector((state) => state.login);
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
              interpretation
            </MDTypography>
            <MDButton
              color={"info"}
              variant="contained"
              size="small"
              onClick={() => {
                if (product === "Onquer") {
                  const link = document.createElement("a");
                  link.href = OnQuer_DemoReport;
                  link.download = "OnQuer_DemoReport.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else if (product === "InheriGene") {
                  const link = document.createElement("a");
                  link.href = InheriGeneReport;
                  link.download = "InheriGene_DemoReport.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              Download Report
            </MDButton>
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
                  title="interpretation Detail"
                  description=""
                  info={{
                    ...getInterPretationObjet(),
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

export default InterpretationPage;
