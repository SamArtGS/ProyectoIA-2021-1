import React,{useState,useRef} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import CardBody from "components/Card/CardBody.js";
import * as XLSX from 'xlsx';
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from '@material-ui/core/Grid';

import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as d3 from "d3";

const styles = {
  
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  input: {
    display: 'none',
  },
  formControl: {
    margin: 0,
    fontSize: "14px",
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: 0,
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
  
};









const useStyles = makeStyles(styles);

export default Dashboard => {
  const matrizCorrelacion = useRef('');
  

  const classes = useStyles();

  const [data2, setData2] = useState([]);


  const handleMatriz = (evento) => {
                let margin = {top: 20, right: 20, bottom: 20, left: 20},
                width = 100 - margin.left - margin.right,
                height = 100 - margin.top - margin.bottom
                

              // Crear el SVG, para mostrar la matriz de correlación, uso del hook, TODO: Custom hook

              let svg = d3.select(matrizCorrelacion.current)
              .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_correlogram.csv", function(error, rows) {

                // Going from wide to long format
                let arreglito = [];
                rows.forEach((d) => {
                  let x = d[""];
                  delete d[""];
                  for (let i=0;i<d.length;i++) {
                    let y = i;
                      let value = d[i];
                      arreglito.push({
                      x: x,
                      y: y,
                      value: +value
                    });
                  }
                });

                setData2(arreglito);

                // List of all variables and number of them
                let domain = d3.set(data2.map(d =>  d.x )).values()

                // Create a color scale
                let color = d3.scaleLinear()
                  .domain([-1, 0, 1])
                  .range(["#B22222", "#fff", "#000080"]);

                // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
                let size = d3.scaleSqrt()
                  .domain([0, 1])
                  .range([0, 9]);

                // X scale
                let x = d3.scalePoint()
                  .range([0, width])
                  .domain(domain)

                // Y scale
                var y = d3.scalePoint()
                  .range([0, height])
                  .domain(domain)

                // Create one 'g' element for each cell of the correlogram

                let cor = svg.selectAll(cor)
                  .data(data2)
                  .enter()
                  .append("g")
                    .attr("class", "cor")
                    .attr("transform", function(d) {
                      return "translate(" + x(d.x) + "," + y(d.y) + ")";
                    });

                // Low left part + Diagonal: Add the text with specific color
                cor.filter(function(d){
                    var ypos = domain.indexOf(d.y);
                    var xpos = domain.indexOf(d.x);
                    return xpos <= ypos;
                  })
                  .append("text")
                    .attr("y", 5)
                    .text(function(d) {
                      if (d.x === d.y) {
                        return d.x;
                      } else {
                        return d.value.toFixed(2);
                      }
                    })
                    .style("font-size", 11)
                    .style("text-align", "center")
                    .style("fill", function(d){
                      if (d.x === d.y) {
                        return "#000";
                      } else {
                        return color(d.value);
                      }
                    });


                // Up right part: add circles
                cor.filter(function(d){
                    var ypos = domain.indexOf(d.y);
                    var xpos = domain.indexOf(d.x);
                    return xpos > ypos;
                  })
                  .append("circle")
                    .attr("r", function(d){ return size(Math.abs(d.value)) })
                    .style("fill", function(d){
                      if (d.x === d.y) {
                        return "#000";
                      } else {
                        return color(d.value);
                      }
                    })
                    .style("opacity", 0.8)

                });

  }






    const [columns, setColumns] = useState([]);
    const [header, setHeaders] = useState([]);
    const [data, setData] = useState([]);

    // process CSV data
    const processData = dataString => {
      const dataStringLines = dataString.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      
      const list = [];
      for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length == headers.length) {
          let arreglo = [];
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] == '"')
                d = d.substring(1, d.length - 1);
              if (d[d.length - 1] == '"')
                d = d.substring(d.length - 2, 1);
            }
            arreglo.push(d);
          }
          list.push(arreglo);
        }
      }
      // prepare columns list from headers
      const columns = headers.map(c => ({
        name: c,
        selector: c,
      }));


      setHeaders(headers);
      setData(list);
      setColumns(columns);

    }
  
// handle file upload
const handleFileUpload = e => {
  handleMatriz(e);
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    /* Parse data */
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: 'binary' });
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    processData(data);
  };
  reader.readAsBinaryString(file);
}
console.log(header);
console.log(data);

  const [age, setAge] = useState('');


  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <Grid item xs={12} sm={12} md={12}>       
          <label htmlFor="contained-button-file">
              <Button variant="contained" color="success" component="span">
                      Subir Archivo
            </Button>
            </label>
            </Grid >
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Análisis general de variables</h4>
              <p className={classes.cardCategoryWhite}>Datos estadísticos del dataset</p>
              <input aligh="right" className={classes.input} type="file" accept=".csv,.xlsx,.xls" id="contained-button-file" onChange={handleFileUpload} />
          </CardHeader>
            <CardBody>
              <GridContainer>

              <GridItem xs={12} sm={12} md={12}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Num elementos a analizar</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={age}
                          onChange={handleChange}
                        >
                          
                          <MenuItem value={10}>1</MenuItem>
                          <MenuItem value={20}>2</MenuItem>
                          <MenuItem value={30}>3</MenuItem>


                        </Select>
                      </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Elemento</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={age}
                          onChange={handleChange}
                        >
                          
                          <MenuItem value={10}>1</MenuItem>
                          <MenuItem value={20}>2</MenuItem>
                          <MenuItem value={30}>3</MenuItem>


                        </Select>
                      </FormControl>
              </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              
            </CardFooter>
          </Card>
        </GridItem>



        <GridItem xs={12} sm={12} md={12}>
      
      <Card>
        <CardHeader color="danger">
          <h4 className={classes.cardTitleWhite}>Matriz de Correlación</h4>
          <p className={classes.cardCategoryWhite}>
            Visualización
          </p>
        </CardHeader>
        <CardBody>
          
        <div ref={matrizCorrelacion} ></div>
        </CardBody>
      </Card>
    </GridItem>





      <GridItem xs={12} sm={12} md={12}>
      
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Tabla de datos</h4>
            <p className={classes.cardCategoryWhite}>
              Contenido del archivo
            </p>
          </CardHeader>
          <CardBody>
            
            <Table
              tableHeaderColor="primary"
              tableHead={header}
              tableData={data}
            />
          </CardBody>
        </Card>
      </GridItem>
      
    </GridContainer>
  );
}
