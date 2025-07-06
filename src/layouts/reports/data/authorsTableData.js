import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { store } from "store/store";

export default function data(reportId) {
  const { files } = store.getState()?.files;

  const getFiles = () => {
    const currentRecord = files.filter((item) => item?.id == reportId);
    const newData = files.filter((item) => item?.project_name == currentRecord?.[0]?.project_name);
    return newData;
  };

  getFiles();
  const Title = ({ name, item, onClick, isLink }) => (
    <MDBox
      onClick={onClick}
      display="flex"
      alignItems="center"
      lineHeight={1}
      style={{ cursor: "pointer" }}
    >
      <MDTypography
        display="block"
        color={isLink ? "info" : "text"}
        variant="button"
        fontWeight="medium"
      >
        {name}
      </MDTypography>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "Sample Name", accessor: "sampleName", width: "20%", align: "left" },
      { Header: "File Size", accessor: "fileSize", align: "center" },
      { Header: "Date", accessor: "date", align: "center" },
      { Header: "Time", accessor: "time", align: "center" },
      { Header: "Annotation", accessor: "annotation", align: "center" },
      { Header: "Report", accessor: "report", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
    ],

    rows: [
      ...(getFiles() ?? []).map((item, index) => {
        const reportId = item?.id;
        return {
          id: <Title name={index + 1 + ""} />,
          sampleName: (
            <Title
              name={item?.SampleName}
              onClick={() => {
                const event = new CustomEvent("navigate-to-item-detail", { detail: { reportId } });
                window.dispatchEvent(event);
              }}
            />
          ),
          fileSize: item?.fileSize || "-",
          date: item?.createdAt || "-",
          time: item?.TimeAt || "-",
          annotation: (
            <Title
              name={"Analyse"}
              isLink={true}
              onClick={() => {
                // Navigate directly to /analyse/:reportId
                window.location.href = `/analyse/${reportId}`;
              }}
            />
          ),
          report: item?.file_link ? (
            <a
              href={item.file_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <DownloadIcon fontSize="small" style={{ verticalAlign: "middle" }} />
              Download
            </a>
          ) : (
            "-"
          ),
          status: (
            <MDBox>
              <MDBadge
                badgeContent={item?.status || "-"}
                color={item?.status === "Completed" ? "success" : "warning"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          action: (
            <DeleteIcon onClick={() => {}} color="warning" style={{ height: 24, width: 24 }} />
          ),
        };
      }),
    ],
  };
}
