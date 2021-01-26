import Dashboard from "@material-ui/icons/Dashboard";
import StartRate from "@material-ui/icons/StarRate";
import Cached from "@material-ui/icons/Cached";
import Bubble_Chart from "@material-ui/icons/BubbleChart";
import Straighten from "@material-ui/icons/Straighten";
import RegLS from "@material-ui/icons/ShowChart";
import RegLG from "@material-ui/icons/MultilineChartOutlined";
import Hospital from "@material-ui/icons/LocalHospital";
import RegLM from "@material-ui/icons/Grain"

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Apriori from "views/Apriori/Apriorio.js";
import CoPearson from "views/CoPearson/CoPearson.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import Distancias from "views/Distancias/Distancias.js";
import Clustering from "views/Clustering/Clustering.js";
import RegresionLin from "views/RegresionLin/RegresionLin.js";
import RegresionLog from "views/RegresionLog/RegresionLog.js";
import NotaMedica from "views/NotaMedica/NotaMedica.js"


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
    path: "/diagnosticomedico",
    name: "Diagnóstico Médico",
    icon: Hospital,
    component: NotaMedica,
    layout: "/admin"
  },

  
];

export default dashboardRoutes;
