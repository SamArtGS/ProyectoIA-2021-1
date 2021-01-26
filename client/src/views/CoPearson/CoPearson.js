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
import Grid from '@material-ui/core/Grid';
import Plot from 'react-plotly.js'; // El precioso
import TeX from '@matejmazur/react-katex';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from '@material-ui/core/NativeSelect';

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
const pcorr = require('compute-pcorr');

export default Dashboard => {
  const [matrizCorrelacion,setmatrizCorrelacion] = useState([]);
  const classes = useStyles();
  const [listaNumerica, setListaNumerica] = useState([[1,2,3],[4,5,6],[7,8,9]]);
  const [header, setHeaders] = useState([]);
  const [data, setData] = useState([]);

  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
    
  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    let listaNum = [];
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
        listaNum.push(arreglo.map((x,j,a)=>{
          return parseFloat(x);
        }));
      }
    }
    setListaNumerica(listaNum);
    setmatrizCorrelacion(pcorr(listaNum[0].map((_, c) => listaNum.map(r => r[c]))));
    console.log((listaNum[0].map((_, c) => listaNum.map(r => r[c])))[0]);
    console.log((listaNum[0].map((_, c) => listaNum.map(r => r[c])))[1]);
    setHeaders(headers);
    setData(list);
  }
  
// handle file upload
const handleFileUpload = e => {
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

const handleChangeVariable1 = (event) => {
  setVariable1(event.target.value);
};

const handleChangeVariable2 = (event) => {
  setVariable2(event.target.value);
};

const [variable1, setVariable1] = useState(0);
const [variable2, setVariable2] = useState(1);

// const GenerarGrafica = (event) =>{
//   let arreglo = [];
//   let contador = 1;
//     arreglo.push(
//       {
//         x: elemento["cluster"].map( (integrante) => {
//                return parseFloat(integrante[parseInt(x)]);
//        }),
//         y: elemento["cluster"].map( (integrante) => {
//                return parseFloat(integrante[parseInt(y)]);
//        }),
//         type: 'scatter',
//         mode: 'markers',
//       }
//     );
//     contador++;
// } 



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
                <GridItem>
                <p>
              El coeficiente de correlación de Pearson es una prueba que mide la relación estadística entre dos variables continuas. 
              Si la asociación entre los elementos no es lineal, entonces el coeficiente no se encuentra representado adecuadamente.
              </p>
              <p>
              El coeficiente de correlación puede tomar un rango de valores de +1 a -1. Un valor de 0 indica que no hay asociación entre las dos variables. 
              Un valor mayor que 0 indica una asociación positiva. Es decir, a medida que aumenta el valor de una variable, también lo hace el valor de la otra. 
              Un valor menor que 0 indica una asociación negativa; es decir, a medida que aumenta el valor de una variable, el valor de la otra disminuye.
              </p>
              
              
              <TeX block math={` r_{xy} = \\frac{ \\sum Z_x Z_y}{ { N }}`}  />
       

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
          
            <Plot
                    data={[{
                      x: header,
                      y: header,
                      z: matrizCorrelacion,
                      type:  'heatmap',
                      showscale: false
                    }]}
                    useResizeHandler = {true}
                    layout={ { title: 'Matriz de Correlación', 
                    autosize : true, 
                    
                      } }
                    
                    style={{width: "100%", height: "100%"}}

                  />


                  <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1}
                            onChange={handleChangeVariable1}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable ordenada</InputLabel>
                        <NativeSelect
                            value={variable2}
                            onChange={handleChangeVariable2}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                  <Plot
                    data={[{
                      x: (listaNumerica[0].map((_, c) => listaNumerica.map(r => r[c])))[variable1],
                      y: (listaNumerica[0].map((_, c) => listaNumerica.map(r => r[c])))[variable2],
                      type: 'scatter',
                      mode: 'markers',
                      marker: {color: 'blue'},
                      name: 'Elementos'
                    }]}
                    useResizeHandler = {true}
                    layout={ { title: 'Relación Gráfica', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />


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
