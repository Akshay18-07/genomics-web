import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { store } from "store/store";
import { getUniqueProjectFiles } from "utils/getUniqueProjectFiles";

const Title = ({ text, onClick }) => (
  <MDBox
    onClick={onClick}
    style={{ cursor: "pointer" }}
    display="flex"
    alignItems="center"
    lineHeight={1}
  >
    <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
      {text}
    </MDTypography>
  </MDBox>
);

const Desc = ({ desc }) => (
  <MDTypography variant="caption" color="text" fontWeight="medium">
    {desc}
  </MDTypography>
);

export default function data(onClick) {
  const { files } = store.getState()?.files;

  return {
    columns: [
      { Header: "ID", accessor: "companies", width: "5%", align: "left" },
      { Header: "Sample Name", accessor: "members", width: "40%", align: "left" },
      { Header: "Status", accessor: "budget", align: "center" },
      { Header: "Created Date", accessor: "completion", align: "center" },
    ],
    rows: [...getUniqueProjectFiles(files).slice(0, 7)].map((item, index) => ({
      companies: <Title text={index + 1 + ""} />,
      members: <Title onClick={() => onClick(item)} text={item?.project_name} />,
      budget: (
        <MDBox>
          <MDBadge
            badgeContent={item?.status}
            color={item?.status == "Completed" ? "success" : "info"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      completion: <Desc desc={item?.createdAt} />,
    })),
  };
}

export { Title, Desc };
