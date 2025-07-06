import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import WeeklyReport from "./components/weeklyReports";

function Dashboard() {
  const { tasks } = reportsLineChartData;

  const TopCards = () => (
    <Grid container spacing={3} mt={2}>
      <Grid item xs={12} md={6} lg={4}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="dark"
            icon="weekend"
            title="Cases"
            count={281}
            percentage={{
              color: "success",
              amount: "",
              label: "Total cases created.",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            icon="leaderboard"
            title="Total Reports"
            count="2,300"
            percentage={{
              color: "success",
              amount: "",
              label: "Total reports uploaded.",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="primary"
            icon="person_add"
            title="Contact Us"
            count="+91-xxx-xxxx-xxx"
            percentage={{
              color: "success",
              amount: "",
              label: "Call us for support",
            }}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
  const Charts = () => {
    return (
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <ReportsBarChart
                color="info"
                title="weekly Analysis"
                description="Reports uploaded this week."
                date="30 Jun - 06 July"
                chart={reportsBarChartData}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <ReportsLineChart
                color="dark"
                title="Monthly Analysis"
                description="Reports uploaded this year."
                date="2025-26"
                chart={tasks}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    );
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TopCards />
      <Charts />
      <WeeklyReport />
    </DashboardLayout>
  );
}

export default Dashboard;
