import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

//ICONOS
import Dashboard from "@material-ui/icons/Dashboard";
import StartRate from "@material-ui/icons/StarRate";
import Cached from "@material-ui/icons/Cached";
import Bubble_Chart from "@material-ui/icons/BubbleChart";
import Straighten from "@material-ui/icons/Straighten";
import RegLS from "@material-ui/icons/ShowChart";
import RegLG from "@material-ui/icons/MultilineChartOutlined";
import Hospital from "@material-ui/icons/LocalHospital";
import RegLM from "@material-ui/icons/Grain"

import { bugs, website, server } from "helpers/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "helpers/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Star } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default Dashboard => {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <StartRate/>
              </CardIcon>
              <p className={classes.cardCategory}>Apriori Relacion</p>
              <h3 className={classes.cardTitle}>34</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Cached />
              </CardIcon>
              <p className={classes.cardCategory}>Correlación Pearson</p>
              <h3 className={classes.cardTitle}>43</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Straighten/>
              </CardIcon>
              <p className={classes.cardCategory}>Metricas Distancias</p>
              <h3 className={classes.cardTitle}>31</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <Bubble_Chart />
              </CardIcon>
              <p className={classes.cardCategory}>Clustering Particional</p>
              <h3 className={classes.cardTitle}>17</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <RegLS/>
              </CardIcon>
              <p className={classes.cardCategory}>Reg. Lineal Simple.</p>
              <h3 className={classes.cardTitle}>25</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <RegLM/>
              </CardIcon>
              <p className={classes.cardCategory}>Reg. Lineal Múltiple</p>
              <h3 className={classes.cardTitle}>22</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <RegLG/>
              </CardIcon>
              <p className={classes.cardCategory}>Regresión Logística</p>
              <h3 className={classes.cardTitle}>11</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Hospital/>
              </CardIcon>
              <p className={classes.cardCategory}>Notas Médica RL</p>
              <h3 className={classes.cardTitle}>7</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                  Consultas realizadas
              </div>
            </CardFooter>
          </Card>
        </GridItem>

      </GridContainer>
      
      
    </div>
  );
}
