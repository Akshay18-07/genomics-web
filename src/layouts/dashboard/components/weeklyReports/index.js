import Grid from "@mui/material/Grid";
import Projects from "layouts/dashboard/components/Projects";

const WeeklyReport = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Projects />
      </Grid>
    </Grid>
  );
};

export default WeeklyReport;
