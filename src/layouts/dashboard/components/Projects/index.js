// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Projects/data";
import { useNavigate } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();
  const onClick = (item) => {
    navigate(`/reports/${item.id}/list`);
  };
  const { columns, rows } = data(onClick);
  const Header = () => {
    return (
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Cases
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Latest 7 cases.</strong>
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    );
  };
  return (
    <Card>
      <Header />
      <DataTable
        table={{ columns, rows }}
        showTotalEntries={false}
        isSorted={false}
        noEndBorder
        entriesPerPage={false}
      />
    </Card>
  );
}

export default Projects;
