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
import InputLabel from "@material-ui/core/InputLabel";
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import TeX from '@matejmazur/react-katex';
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
  const [p,setP] = useState(2);
  const [header, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [numClustersLabel,setNumLabelsClusters] = useState(5);

  const [variable1Euclidiana, setVariable1Euclidiana] = useState(0);
  const [variable2Euclidiana, setVariable2Euclidiana] = useState(1);
  const [variable1Cheviseb, setVariable1Cheviseb] = useState(0);
  const [variable2Cheviseb, setVariable2Cheviseb] = useState(1);

  const [variable1Manhattan, setVariable1Manhattan] = useState(0);
  const [variable2Manhattan, setVariable2Manhattan] = useState(1);

  const [variable1Mitosky, setVariable1Mitosky] = useState(0);
  const [variable2Mitosky, setVariable2Mitosky] = useState(1);

  const [clustersEuclidiana,setClustersEuclidiana] = useState([{centroid: [1,2,3], cluster: [[1,2,3],[4,5,6]]}]);
  const [clustersChevishev,setClustersChevishev] = useState([{centroid: [1,2,3], cluster: [[1,2,3],[4,5,6]]}]);
  const [clustersManhattan,setClustersManhattan] = useState([{centroid: [1,2,3], cluster: [[1,2,3],[4,5,6]]}]);
  const [clustersMintosky,setclustersMintosky] = useState([{centroid: [1,2,3], cluster: [[1,2,3],[4,5,6]]}]);
  const [resultadoKMeans1, setResultadoKMeans1] = useState([]);
  const [resultadoKMeans2, setResultadoKMeans2] = useState([]);
  const [resultadoKMeans3, setResultadoKMeans3] = useState([]);
  const [resultadoKMeans4, setResultadoKMeans4] = useState([]);



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
      Clusterizar(numClustersLabel,list,1,variable1Euclidiana,variable2Euclidiana);
      Clusterizar(numClustersLabel,list,2,variable1Euclidiana,variable2Euclidiana);
      Clusterizar(numClustersLabel,list,3,variable1Euclidiana,variable2Euclidiana);
      Clusterizar(numClustersLabel,list,4,variable1Euclidiana,variable2Euclidiana);
      setHeaders(headers);
      setData(list);
  }

  const handleChangeLambda = (event) => {
    setP(event.target.value);
    Clusterizar(numClustersLabel,data,4,variable1Mitosky,variable2Mitosky);
  };

  const handleChangeNumClustersEuclidiana = (event) => {
    setNumLabelsClusters(event.target.value);
    Clusterizar(event.target.value,data,1,variable1Euclidiana,variable2Euclidiana);
  };

  const handleChangeNumClustersChevisev = (event) => {
    setNumLabelsClusters(event.target.value);
    Clusterizar(event.target.value,data,2,variable1Cheviseb.id,variable2Cheviseb);
  };

  const handleChangeNumClustersManhattan = (event) => {
    setNumLabelsClusters(event.target.value);
    Clusterizar(event.target.value,data,3,variable1Manhattan.id,variable2Manhattan);
  };

  const handleChangeNumClustersMitosky = (event) => {
    setNumLabelsClusters(event.target.value);
    Clusterizar(event.target.value,data,4,variable1Mitosky.id,variable2Mitosky);
  };

  const handleChangeVariable1Euclidiana = (event) => {
    setVariable1Euclidiana(event.target.value);
    Clusterizar(numClustersLabel,data,1,event.target.value,variable2Euclidiana);
  };

  const handleChangeVariable2Euclidiana = (event) => {
    setVariable2Euclidiana(event.target.value);
    Clusterizar(numClustersLabel,data,1,variable1Euclidiana,event.target.value);
  };

  const handleChangeVariable1Chevisheb = (event) => {
    setVariable1Cheviseb(event.target.value);
    Clusterizar(numClustersLabel,data,2,event.target.value,variable2Cheviseb);
  };

  const handleChangeVariable2Chevisheb = (event) => {
    setVariable2Cheviseb(event.target.value);
    Clusterizar(numClustersLabel,data,2,variable2Cheviseb,event.target.value);
  };

  const handleChangeVariable1Manhattan = (event) => {
    setVariable1Manhattan(event.target.value);
    Clusterizar(numClustersLabel,data,3,event.target.value,variable2Manhattan);
  };

  const handleChangeVariable2Manhattan = (event) => {
    setVariable2Manhattan(event.target.value);
    Clusterizar(numClustersLabel,data,3,variable2Manhattan,event.target.value);
  };

  const handleChangeVariable1Mitoski = (event) => {
    setVariable1Mitosky(event.target.value);
    Clusterizar(numClustersLabel,data,4,event.target.value,variable2Mitosky);
  };

  const handleChangeVariable2Mitoski = (event) => {
    setVariable2Mitosky(event.target.value);
    Clusterizar(numClustersLabel,data,4,variable1Mitosky,event.target.value);
  };


  const EcuacionChebyshev = (Ei,Ej) => {
    return Math.max(...Ei.map((x, i) => Math.abs( x - Ej[i] )));
  }

  const EcuacionManhattan = (Ei,Ej) => {
    return Ei.map((x, i) => Math.abs( x - Ej[i] )).reduce((suma, actual) => suma + actual);
  }

  const EcuacionMinkowsky = (Ei,Ej) => {
    return Ei.map((x, i) => Math.abs( x - Ej[i] ) ** p) // a la p de las diferencias
             .reduce((sum, now) => sum + now) // suma de los anteriores
             ** (1/p) // Raíz enésima
  }

  const Clusterizar = (numClusters,listaElementos,distancias,x,y) => {
    switch (distancias){
      case 1:
        kmeans.clusterize(listaElementos, {k: numClusters}, (err,res) => {
          if (err){ 
            console.error("Hubo un error al hacer el kmeans");
          } else {
            setResultadoKMeans1(res);
            let arreglo = [];
            let colores = ['yellow','brown','red','orange','green','blue','purple'];
            let contador = 1;
            res.forEach((elemento) => {
              arreglo.push(
                {
                  x: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(x)]);
                 }),
                  y: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(y)]);
                 }),
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: colores.pop()},
                  name: 'Cluster '+contador.toString()
                }
              );
              contador++;
            });
            setClustersEuclidiana(arreglo);
          }
        });
        break;
      case 2:
        kmeans.clusterize(listaElementos, {k: numClusters, distace: EcuacionChebyshev}, (err,res) => {
          if (err){ 
            console.error("Hubo un error al hacer el kmeans");
          } else {
            setResultadoKMeans2(res);
            let arreglo = [];
            let colores = ['yellow','brown','red','orange','green','blue','purple'];
            let contador = 1;
            res.forEach((elemento) => {
              arreglo.push(
                {
                  x: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(x)]);
                 }),
                  y: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(y)]);
                 }),
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: colores.pop()},
                  name: 'Cluster '+contador.toString()
                }
              );
              contador++;
            });
            setClustersChevishev(arreglo);
          }
        });
        break;
      case 3:
        kmeans.clusterize(listaElementos, {k: numClusters, distace: EcuacionManhattan}, (err,res) => {
          if (err){ 
            console.error("Hubo un error al hacer el kmeans");
          } else {
            setResultadoKMeans3(res);
            let arreglo = [];
            let colores = ['yellow','brown','red','orange','green','blue','purple'];
            let contador = 1;
            res.forEach((elemento) => {
              arreglo.push(
                {
                  x: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(x)]);
                 }),
                  y: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(y)]);
                 }),
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: colores.pop()},
                  name: 'Cluster '+contador.toString()
                }
              );
              contador++;
            });
            setClustersManhattan(arreglo);
          }
        });
        break;
      case 4:
        kmeans.clusterize(listaElementos, {k: numClusters, distace: EcuacionMinkowsky}, (err,res) => {
          if (err){ 
            console.error("Hubo un error al hacer el kmeans");
          } else {
            setResultadoKMeans4(res);
            let arreglo = [];
            let colores = ['yellow','brown','red','orange','green','blue','purple'];
            let contador = 1;
            res.forEach((elemento) => {
              arreglo.push(
                {
                  x: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(x)]);
                 }),
                  y: elemento["cluster"].map( (integrante) => {
                         return parseFloat(integrante[parseInt(y)]);
                 }),
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: colores.pop()},
                  name: 'Cluster '+contador.toString()
                }
              );
              contador++;
            });
            setclustersMintosky(arreglo);
          }
        });
        break;
      default:
        console.log("No se desarrolló correctamente");
        break;
    }
  }

  const Elbow = (numClusters,listaElementos,distancias,x,y) =>{
    for(let i = 0; i < 9; i++){
      kmeans.clusterize(listaElementos, {k: numClusters, distace: EcuacionChebyshev}, (err,res) => {
        if (err){ 
          console.error("Hubo un error al hacer el kmeans");
        } else {
          console.log("nada")
        }
      });
    }
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
              <p>
              K-Means es un método de agrupamiento o clustering. 
              El clustering es una técnica para encontrar y clasificar K grupos de datos (clusters). 
              Así, los elementos que comparten características semejantes estarán juntos en un mismo grupo, separados de los otros grupos con los que no comparten características. 
              </p>
              <p>Para saber si los datos son parecidos o diferentes el algoritmo K-medias utiliza la distancia entre los datos. 
                Las observaciones que se parecen tendrán una menor distancia entre ellas. 
                En general, como medida se utiliza la distancia euclideana aunque también se pueden utilizar otras funciones.</p>
                <p>
                Dado un conjunto de observaciones (x1, x2, …, xn), 
                donde cada observación es un vector real de d dimensiones, 
                k-medias construye una partición de las observaciones en k conjuntos (k ≤ n) 
                a fin de minimizar la suma de los cuadrados dentro de cada grupo.
                </p>

                <TeX block math={`arg_s min  \\sum_{i=1}^k \\sum_{x \\in S_i}  || x - \\mu_i|| ^2 = arg_s min \\sum_{i=1}^k |S_i|Var S_i`}  />

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
                        onChange={handleChangeNumClustersEuclidiana}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1Euclidiana}
                            onChange={handleChangeVariable1Euclidiana}
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
                            value={variable2Euclidiana}
                            onChange={handleChangeVariable2Euclidiana}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                  <Plot
                    data={clustersEuclidiana}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1Euclidiana],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2Euclidiana],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  <Plot
                  useResizeHandler = {true}
                  data={[
                    {
                      x: Array.from({length: numClustersLabel}, (_, index) => index + 1), 
                      y: resultadoKMeans1.map((x,i,a)=>{
                        return x.cluster.length
                      }),
                      type: 'bar'
                      
                    },
                  ]}
                  layout={ { title: 'Cantidad de elementos por cluster', autosize : true, 
                  xaxis: {
                    title: {
                      text: "Cluster",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Cantidad",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    }
                  }
                  } }
                  style={{width: "100%", height: "100%"}}
                />
                  <Table
                  tableHeaderColor="info"
                  tableHead={["Cluster","Centroide","Elementos dentro del cluster"]}
                  tableData={Object.values(resultadoKMeans1).map((x,i,a)=>{ 
                    return [(i+1).toString(),
                      "["+x.centroid.map((each)=> Number(each.toFixed(2))).toString()+"]",
                      x.cluster.map((s,j,k)=>{ return "["+s.toString()+"]"}).toString()]
                  })
                  }
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
                        onChange={handleChangeNumClustersChevisev}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1Cheviseb}
                            onChange={handleChangeVariable1Chevisheb}
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
                            value={variable2Cheviseb}
                            onChange={handleChangeVariable2Chevisheb}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                      <Plot
                    data={clustersChevishev}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1Cheviseb],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2Cheviseb],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  <Plot
                  useResizeHandler = {true}
                  data={[
                    {
                      x: Array.from({length: numClustersLabel}, (_, index) => index + 1), 
                      y: resultadoKMeans2.map((x,i,a)=>{
                        return x.cluster.length
                      }),
                      type: 'bar'
                    },
                  ]}
                  layout={ { title: 'Cantidad de elementos por cluster', autosize : true, 
                  xaxis: {
                    title: {
                      text: "Cluster",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Cantidad",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    }
                  }
                  } }
                  style={{width: "100%", height: "100%"}}
                />
                <Table
                  tableHeaderColor="info"
                  tableHead={["Cluster","Centroide","Elementos dentro del cluster"]}
                  tableData={Object.values(resultadoKMeans2).map((x,i,a)=>{ 
                    return [(i+1).toString(),
                      "["+x.centroid.map((each)=> Number(each.toFixed(2))).toString()+"]",
                      x.cluster.map((s,j,k)=>{ return "["+s.toString()+"]"}).toString()]
                  })
                  }
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
                        onChange={handleChangeNumClustersManhattan}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1Manhattan}
                            onChange={handleChangeVariable1Manhattan}
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
                            value={variable2Manhattan}
                            onChange={handleChangeVariable2Manhattan}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                      <Plot
                    data={clustersManhattan}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1Manhattan],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2Manhattan],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  <Plot
                  useResizeHandler = {true}
                  data={[
                    {
                      x: Array.from({length: numClustersLabel}, (_, index) => index + 1), 
                      y: resultadoKMeans3.map((x,i,a)=>{
                        return x.cluster.length
                      }),
                      type: 'bar'
                    },
                  ]}
                  layout={ { title: 'Cantidad de elementos por cluster', autosize : true, 
                  xaxis: {
                    title: {
                      text: "Cluster",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Cantidad",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    }
                  }
                  } }
                  style={{width: "100%", height: "100%"}}
                />
                <Table
                  tableHeaderColor="info"
                  tableHead={["Cluster","Centroide","Elementos dentro del cluster"]}
                  tableData={Object.values(resultadoKMeans3).map((x,i,a)=>{ 
                    return [(i+1).toString(),
                      "["+x.centroid.map((each)=> Number(each.toFixed(2))).toString()+"]",
                      x.cluster.map((s,j,k)=>{ return "["+s.toString()+"]"}).toString()]
                  })
                  }
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
                        style={{ margin: 8 }}
                        value={p}
                        onChange={handleChangeLambda}
                      />
                      
                      <TextField
                        label="Num Clusters"
                        style={{ margin: 8 }}
                        value={numClustersLabel}
                        onChange={handleChangeNumClustersMitosky}
                      />
                      <FormControl className={classes.formControl} style={{ margin: 8 }}>
                        <InputLabel shrink htmlFor="age-native-label-placeholder">Variable absisa</InputLabel>
                        <NativeSelect
                            value={variable1Mitosky}
                            onChange={handleChangeVariable1Mitoski}
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
                            value={variable2Mitosky}
                            onChange={handleChangeVariable2Mitoski}
                          >
                            <option value="">Ninguna</option>
                            {header.map((value, index) => {
                                return <option value={index}>{value}</option>
                            })}
                          </NativeSelect>
                      </FormControl>
                
                
                      <Plot
                    data={clustersMintosky}
                    useResizeHandler = {true}
                    layout={ { title: 'K Medias - 2 variables', autosize : true, 
                    xaxis: {
                      title: {
                        text: header[variable1Mitosky],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      },
                    },
                    yaxis: {
                      title: {
                        text: header[variable2Mitosky],
                        font: {
                          family: 'Courier New, monospace',
                          color: '#000000'
                        }
                      }
                    }
                    }}
                    style={{width: "100%", height: "100%"}}
                  />
                  <Plot
                  useResizeHandler = {true}
                  data={[
                    {
                      x: Array.from({length: numClustersLabel}, (_, index) => index + 1), 
                      y: resultadoKMeans4.map((x,i,a)=>{
                        return x.cluster.length
                      }),
                      type: 'bar'
                    },
                  ]}
                  layout={ { title: 'Cantidad de elementos por cluster', autosize : true, 
                  xaxis: {
                    title: {
                      text: "Cluster",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Cantidad",
                      font: {
                        family: 'Courier New, monospace',
                        color: '#000000'
                      }
                    }
                  }
                  } }
                  style={{width: "100%", height: "100%"}}
                />
                <Table
                  tableHeaderColor="info"
                  tableHead={["Cluster","Centroide","Elementos dentro del cluster"]}
                  tableData={Object.values(resultadoKMeans4).map((x,i,a)=>{ 
                    return [(i+1).toString(),
                      "["+x.centroid.map((each)=> Number(each.toFixed(2))).toString()+"]",
                      x.cluster.map((s,j,k)=>{ return "["+s.toString()+"]"}).toString()]
                  })
                  }
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
