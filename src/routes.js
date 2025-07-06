import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";

import SignIn from "layouts/authentication/sign-in";

import Icon from "@mui/material/Icon";
import Form from "layouts/form";

import ReportList from "layouts/reports/SelectItem";
import ReportDetail from "layouts/reports/ReportDetail";
import Analyse from "layouts/analyse";
import Products from "layouts/products";
import InterpretationPage from "layouts/interpretationData";
import ViewSummary from "layouts/ViewSummary";

const app_routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Cases",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },

  {
    type: "collapse",
    name: "Create Report",
    key: "create-report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/create-report",
    component: <Form />,
  },
];

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "route",
    name: "Select Item",
    key: "select-item",
    route: "/reports/:reportId/list",
    component: <ReportList />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Report Detail",
    key: "report-detail",
    route: "/reports/:reportId/detail/:itemId",
    component: <ReportDetail />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Analyse",
    key: "analyse-detail",
    route: "/analyse/:reportId",
    component: <Analyse />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Interpretation",
    key: "interpretation-detail",
    route: "/interpretation/:reportId",
    component: <InterpretationPage />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "View Summary",
    key: "view-summary",
    route: "/summary/:reportId",
    component: <ViewSummary />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Create Report",
    key: "create-report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/create-report",
    component: <Form />,
  },
  {
    type: "collapse",
    name: "Products",
    key: "Products",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/products",
    component: <Products />,
  },
];

export { routes, app_routes };
