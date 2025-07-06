import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DefaultNavbar from "../DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";
import BgVideo from "../../../../assets/videos/loginBg.mp4";
import { useDispatch } from "react-redux";
import { logout } from "store/loginSlice";
import { useNavigate } from "react-router-dom";

function BasicLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <PageLayout>
      <DefaultNavbar
        action={{
          type: "internal",
          label: "Logout",
          color: "dark",
        }}
        isLogout={true}
        onClick={() => {
          alert("Asd");
          // dispatch(logout());
          // navigate.navigate(-1);
        }}
      />
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
          src={BgVideo}
        />
      </MDBox>

      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid
          container
          spacing={1}
          style={{
            paddingTop: "12%",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
          height="100vh"
        >
          {children}
        </Grid>
      </MDBox>
    </PageLayout>
  );
}

BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  video: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
