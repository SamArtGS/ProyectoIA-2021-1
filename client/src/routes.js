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
import StartRate from "@material-ui/icons/StarRate";
import Cached from "@material-ui/icons/Cached";
import Bubble_Chart from "@material-ui/icons/BubbleChart";
import Straighten from "@material-ui/icons/Straighten";
import GraphEq from "@material-ui/icons/GraphicEq";
import RegLS from "@material-ui/icons/ShowChart";
import RegLM from "@material-ui/icons/MultilineChartOutlined";
import Hospital from "@material-ui/icons/LocalHospital";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Apriori from "views/Apriori/Apriorio.js";
import CoPearson from "views/CoPearson/CoPearson.js";

import UserProfile from "views/UserProfile/UserProfile.js";
import Distancias from "views/Distancias/Distancias.js";
import Clustering from "views/Clustering/Clustering.js";
import Typography from "views/Typography/Typography.js";


const dashboardRoutes = [
  {
    path: "/tablero",
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
    name: "Correlación de Pearson",
    rtlName: "Ninguno",
    icon: Cached,
    component: CoPearson,
    layout: "/admin"
  },
  {
    path: "/distancias",
    name: "Distancias",
    icon: Straighten,
    component: Distancias,
    layout: "/admin"
  },
  {
    path: "/clusteringparticional",
    name: "Clustering Particional",
    icon: Bubble_Chart,
    component: Clustering,
    layout: "/admin"
  },
  {
    path: "/regresionlinealsimple",
    name: "Reg. Lineal Simple",
    icon: RegLS,
    component: Typography,
    layout: "/admin"
  },

  {
    path: "/regresionlinealmultiple",
    name: "Reg. Logística",
    icon: RegLM,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/diagnosticomedico",
    name: "Diagnóstico Médico",
    icon: Hospital,
    component: Typography,
    layout: "/admin"
  }
];

export default dashboardRoutes;
