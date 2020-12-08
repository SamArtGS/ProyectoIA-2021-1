/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Language from "@material-ui/icons/Language";
import StartRate from "@material-ui/icons/StarRate";
import Cached from "@material-ui/icons/Cached";
import Bubble_Chart from "@material-ui/icons/BubbleChart";
import Straighten from "@material-ui/icons/Straighten";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Apriori from "views/Apriori/Apriorio.js";
import CoPearson from "views/CoPearson/CoPearson.js";

import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Tablero",
    rtlName: "Tablero",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/apriori",
    name: "Apriori",
    rtlName: "Ninguno",
    icon: StartRate,
    component: Apriori,
    layout: "/admin"
  },
  {
    path: "/copearson",
    name: "CoRel de Pearson",
    rtlName: "Ninguno",
    icon: Cached,
    component: CoPearson,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Distancias",
    icon: LocationOn,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Ap. No Supervisado",
    icon: Bubble_Chart,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Ap. Supervisado",
    icon: Straighten,
    component: TableList,
    layout: "/admin"
  }
];

export default dashboardRoutes;
