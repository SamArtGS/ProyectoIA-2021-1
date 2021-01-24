import React,{useState, useRef,useLayoutEffect} from "react";

// Compotentes de material UI
import { makeStyles } from "@material-ui/core/styles";


// Componentes Core de Material Kit Pro.
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';

import Plot from 'react-plotly.js'; // El precioso

//Estilos propios de la página Distancias
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

const kmeans = require('node-kmeans');

//Componente exportado
export default Clustering => {
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [header, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [raw,setRaw] = useState('');
  const [result,setResults] = useState([]);
  const [tipoDataSet, setTipoDataSet] = useState('');
  const [relacion, setRelacion] = useState('');



  const [numClustersLabel,setNumLabelsClusters] = useState(5);

  //Hooks que contienen las distancias
  const [distEuclidiana, setDistEuclidiana] =  useState([]);
  const [distChebyshev, setDistChebyshev]   =  useState([]);
  const [distManhattan, setDistManhattan]   =  useState([]);
  const [distMinkowsky, setDistMinkowsky]   =  useState([]);

  const [clusters,setClusters] = useState([{centroid: [1,2,3], cluster: [[1,2,3],[4,5,6]]}]);


  const processData = dataString => {
      const dataStringLines = dataString.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);    
      const list = [];
      for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length === headers.length) {
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

      
      
      //Set todos los hooks y realizar los algoritmos
      // Create the data 2D-array (vectors) describing the data
      //Me puede servir para aceptar jsons
      let vectors = new Array();
      for (let i = 0 ; i < data.length ; i++) {
        vectors[i] = [ data[i]['size'] , data[i]['revenue']];
      }
      //Este puede servir para los jsons
      // Se le puede colocar el tipo de distancia euclidiana etc.

      Clusterizar(5,list,2);
      setHeaders(headers);
      setData(list);
      setColumns(columns);

  }


  const handleChangeNumClusters = (event) => {
    setNumLabelsClusters(event.target.value);
    Clusterizar(event.target.value,data,2,0,1);
  };


  const [variable1, setVariable1] = useState({
    name: '',
    id: '0',
  });

  const [variable2, setVariable2] = useState({
    name: '',
    id: '0',
  });


  const handleChangeVariable1 = (event) => {
    console.log(event.target.value);
    setVariable1({ [event.target.name]: event.target.value,
    });
    Clusterizar(numClustersLabel,data,2,event.target.value,variable2);
  };

  const handleChangeVariable2 = (event) => {
    console.log(event.target.value);
    setVariable2({ [event.target.name]: event.target.value,
    });
    Clusterizar(numClustersLabel,data,2,variable1,event.target.value);
  };

  const Clusterizar = (numClusters,listaElementos,distancias,x,y) => {
    kmeans.clusterize(listaElementos, {k: numClusters}, (err,res) => {
      if (err){ 
        console.error(err);
      } else {
        console.log(res);
        let arreglo = [];
        let colores = ['yellow','brown','red','orange','green','blue','purple'];
        let contador = 1;
        res.forEach((elemento) => {
          console.log(elemento);
          arreglo.push(
            {
              x: elemento["cluster"].map( (integrante) => {
                     return integrante[x];
             }),
              y: elemento["cluster"].map( (integrante) => {
                     return integrante[y];
             }),
              type: 'scatter',
              mode: 'markers',
              marker: {color: colores.pop()},
              name: 'Cluster '+contador.toString()
            }
          );
          contador++;
        });
        setClusters(arreglo);
      }
    });
  }
  


  
  // soportar el evento de subida de archivo
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
      const datos = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(datos);
    };
    reader.readAsBinaryString(file);
  }


return (
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        
        <Grid item xs={12} sm={12} md={12} >       
          <label htmlFor="contained-button-file">
              <Button variant="contained" color="success" component="span">
                Subir Archivo
            </Button>
            </label>
            <input aligh="right" className={classes.input} type="file" accept=".csv,.xlsx,.xls,.txt" id="contained-button-file" onChange={handleFileUpload}/>
            </Grid >

          <Card>
          <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Descripción general</h4>
              <p className={classes.cardCategoryWhite}>Algoritmo</p>
              
          </CardHeader>
            <CardBody>
              
            <div className={classes.typo}>
              <div className={classes.note}>Contenido</div>
              <p>
                Blabla
              </p>
            </div>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={12} md={12}  >
        <CustomTabs 
            headerColor="danger"
            tabs={[
              {
                tabName: "Euclidianas",
                 tabContent: (
                   <>
                   <TextField
                        label="Num Clusters"
                        style={{ margin: 8 }}
                        value={numClustersLabel}
                        onChange={handleChangeNumClusters}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1.id}
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
                            value={variable2.id}
                            onChange={handleChangeVariable2}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                  <Plot
                  
                    data={clusters}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1.id],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2.id],
                        font: {
                          family: 'Courier New, monospace',
                          text: header[variable2.id],
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  <Table
                  tableHeaderColor="primary"
                  tableHead={header}
                  tableData={data}
                  />
                  </>
                )
              },
              {
                tabName: "Chebyshev",
             
                tabContent: (
                  <>
                   <TextField
                        label="Num Clusters"
                        style={{ margin: 8 }}
                        value={numClustersLabel}
                        onChange={handleChangeNumClusters}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1.id}
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
                            value={variable2.id}
                            onChange={handleChangeVariable2}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                  <Plot
                  
                    data={clusters}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1.id],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2.id],
                        font: {
                          family: 'Courier New, monospace',
                          text: header[variable2.id],
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  </> 
                )
              },
              {
                tabName: "Manhattan",
                
                tabContent: (
                  <>
                   <TextField
                        label="Num Clusters"
                        style={{ margin: 8 }}
                        value={numClustersLabel}
                        onChange={handleChangeNumClusters}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1.id}
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
                            value={variable2.id}
                            onChange={handleChangeVariable2}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                  <Plot
                  
                    data={clusters}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1.id],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2.id],
                        font: {
                          family: 'Courier New, monospace',
                          text: header[variable2.id],
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  </> 
                )
              },
              {
                tabName: "Minkowsky",
                
                tabContent: (
                  <>
                   <TextField
                        label="Lambda"
                        value={numClustersLabel}
                        onChange={handleChangeNumClusters}
                       
                      />
                      
                      <TextField
                        label="Num Clusters"
                        style={{ margin: 8 }}
                        value={numClustersLabel}
                        onChange={handleChangeNumClusters}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1.id}
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
                            value={variable2.id}
                            onChange={handleChangeVariable2}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                
                
                <Plot
                  data={clusters}
                  useResizeHandler = {true}
                  layout={ { title: 'K Medias - 2 variables', autosize : true, 
                  xaxis: {
                    title: {
                      text: header[variable1.id],
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    },
                  },
                  yaxis: {
                    title: {
                      text: header[variable2.id],
                      font: {
                        family: 'Courier New, monospace',
                        text: header[variable2.id],
                        color: '#000000'
                      }
                    }
                  }
                  }}
                  style={{width: "100%", height: "100%"}}
                />  
                
                  </>
                )
              }
            ]}
          />

        </GridItem>

      <GridItem xs={12} sm={12} md={12}>
      
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Tabla de datos</h4>
            <p className={classes.cardCategoryWhite}>
              Visualización de los datos
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
