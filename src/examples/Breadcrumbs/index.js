import { Link, useLocation, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function Breadcrumbs({ icon, title, route, light }) {
  const location = useLocation();
  const navigate = useNavigate();
  // List of main sidenav routes (update as needed)
  const sidenavRoutes = ["/dashboard", "/tables", "/profile", "/create-report"];
  // Accept both string and array for route
  let routes = Array.isArray(route)
    ? route
    : typeof route === "string"
    ? route.split("/").filter(Boolean)
    : [];
  // Remove the last element for the current page
  const parentRoutes = routes.slice(0, -1);

  // Build the path for each breadcrumb
  let path = "";

  // Check if current path is a main sidenav route
  const isSidenavRoute = sidenavRoutes.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + "/")
  );

  return (
    <MDBox mr={{ xs: 0, xl: 8 }} display="flex" alignItems="center">
      {!isSidenavRoute && (
        <MDButton
          variant="gradient"
          color={light ? "white" : "info"}
          size="small"
          sx={{ minWidth: 0, mr: 2, px: 2, border: 0 }}
          onClick={() => navigate(-1)}
        >
          <Icon color="text">arrow_back</Icon>
        </MDButton>
      )}
      <div style={{ flex: 1 }}>
        <MuiBreadcrumbs
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
            },
          }}
        >
          <Link to="/dashboard">
            <MDTypography
              component="span"
              variant="body2"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              <Icon>{icon}</Icon>
            </MDTypography>
          </Link>
          {parentRoutes.map((el, idx) => {
            path = parentRoutes.slice(0, idx + 1).join("/");

            return (
              <Link key={el}>
                <MDTypography
                  component="span"
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  color={light ? "white" : "dark"}
                  opacity={light ? 0.8 : 0.5}
                  sx={{ lineHeight: 0 }}
                >
                  {el.replace(/-/g, " ")}
                </MDTypography>
              </Link>
            );
          })}
          <MDTypography
            variant="button"
            fontWeight="regular"
            textTransform="capitalize"
            color={light ? "white" : "dark"}
            sx={{ lineHeight: 0 }}
          >
            {title.replace(/-/g, " ")}
          </MDTypography>
        </MuiBreadcrumbs>
        <MDTypography
          fontWeight="bold"
          textTransform="capitalize"
          variant="h6"
          color={light ? "white" : "dark"}
          noWrap
        >
          {title.replace(/-/g, " ")}
        </MDTypography>
      </div>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
