import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "store/store";
import { deleteFile } from "store/fileUploadSlice";
import { getUniqueProjectFiles } from "utils/getUniqueProjectFiles";

export default function authorsTableData(files) {
  const { product } = store.getState()?.login;
  const Title = ({ name, item, onClick }) => (
    <MDBox
      onClick={onClick}
      display="flex"
      alignItems="center"
      lineHeight={1}
      style={{ cursor: "pointer" }}
    >
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  const Desc = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "id", accessor: "id", width: "5%", align: "left" },
    {
      Header: product == "Inherigene" ? "Sample ID" : "Product ID",
      accessor: "sampleName",
      width: "20%",
      align: "left",
    },
    { Header: "Created Date", accessor: "createdDate", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = (getUniqueProjectFiles(files) ?? []).map((item, index) => {
    const reportId = item?.id;
    return {
      id: <Title name={reportId + ""} />,
      sampleName: (
        <Title
          name={item?.project_name}
          onClick={() => {
            const event = new CustomEvent("navigate-to-select-item", { detail: { reportId } });
            window.dispatchEvent(event);
          }}
        />
      ),
      function: <Desc title="Manager" description="Organization" />,
      status: (
        <MDBox>
          <MDBadge
            badgeContent={item?.status}
            color={item?.status == "Completed" ? "success" : "info"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      createdDate: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          23/04/18
        </MDTypography>
      ),
      action: (
        <DeleteIcon
          onClick={() => {
            store.dispatch(deleteFile(reportId));
            window.dispatchEvent(new Event("files-updated"));
          }}
          color="warning"
          style={{ height: 24, width: 24 }}
        />
      ),
    };
  });

  return { columns, rows }; // Ensure rows are structured for pagination
}
