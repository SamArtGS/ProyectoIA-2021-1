import React,{useState} from "react";

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
import Grid from '@material-ui/core/Grid';
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import TextField from '@material-ui/core/TextField';

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


//Componente exportado
export default Distancias => {
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [header, setHeaders] = useState([]);
  const [data, setData] = useState([]);


  const [p,setP] = useState(2);

  //Hooks que contienen las distancias
  const [distEuclidiana, setDistEuclidiana] =  useState([]);
  const [distChebyshev, setDistChebyshev]   =  useState([]);
  const [distManhattan, setDistManhattan]   =  useState([]);
  const [distMinkowsky, setDistMinkowsky]   =  useState([]);

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

      setHeaders(headers);
      setData(list);
      setColumns(columns);
      obtenerDistanciaEuclidiana(list);
      
      obtenerDistanciaChebysheviana(list);
      obtenerDistanciaManhattaniana(list);
      obtenerDistanciaMinkowsky(list);
  }

  const obtenerDistanciaEuclidiana = (list) => {
      const matriz = [];
      list.forEach( (valor) => {
        const listaAux = [];
        list.forEach( (valor2) => {
          listaAux.push(EcuacionEuclides(valor, valor2).toFixed(2).toString());
        });
        matriz.push(listaAux);
      });
      console.log(list);
      console.log(matriz);
      setDistEuclidiana(matriz);
  }


  const obtenerDistanciaChebysheviana = (list) => {
    const matriz = [];
    list.forEach( (valor) => {
      const listaAux = [];
      list.forEach( (valor2) => {
        listaAux.push(EcuacionManhattan(valor, valor2).toFixed(2).toString());
      });
      matriz.push(listaAux);
    });
    setDistChebyshev(matriz);
  }

  const obtenerDistanciaManhattaniana = (list) => {
    const matriz = [];
    list.forEach( (valor) => {
      const listaAux = [];
      list.forEach( (valor2) => {

        listaAux.push(EcuacionChebyshev(valor, valor2).toFixed(2).toString());
      });
      matriz.push(listaAux);
    });
    setDistManhattan(matriz);
  }

  const obtenerDistanciaMinkowsky = (list,lambda) => {
    const matriz = [];
    list.forEach( (valor) => {
      const listaAux = [];
      list.forEach( (valor2) => {
        if(lambda!=0 || lambda > 1 ){
          listaAux.push(EcuacionMinkowsky(valor, valor2,lambda).toFixed(2).toString());
        }else{
          listaAux.push(EcuacionMinkowsky(valor, valor2,1).toFixed(2).toString());
        }
      });
      matriz.push(listaAux);
    });
    setDistMinkowsky(matriz);
}

  
  const EcuacionEuclides = (Ei,Ej) => {
    return Ei.map((x, i) => Math.abs( x - Ej[i] ) ** 2) // al cuadrado de las diferencias
             .reduce((sum, now) => sum + now) // suma
             ** (1/2)
  }

  const EcuacionChebyshev = (Ei,Ej) => {
    return Math.max(...Ei.map((x, i) => Math.abs( x - Ej[i] )));
  }

  const EcuacionManhattan = (Ei,Ej) => {
    return Ei.map((x, i) => Math.abs( x - Ej[i] )).reduce((suma, actual) => suma + actual);
  }

  const EcuacionMinkowsky = (Ei,Ej,p) => {
    return Ei.map((x, i) => Math.abs( x - Ej[i] ) ** p) // a la p de las diferencias
             .reduce((sum, now) => sum + now) // suma de los anteriores
             ** (1/p) // Raíz enésima
  }

  const handleCambioLambda = (valorInputText) => {
    obtenerDistanciaMinkowsky(data,valorInputText);
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
      const datos = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(datos);
    };
    reader.readAsBinaryString(file);
  }
  const handleChange = (event) => {
    setP(event.target.value);
    handleCambioLambda(event.target.value);
  };

return (
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        
        <Grid item xs={12} sm={12} md={12} >       
          <label htmlFor="contained-button-file">
              <Button variant="contained" color="success" component="span">
                      Subir Archivo
            </Button>
            </label>
            <input aligh="right" className={classes.input} type="file" accept=".csv,.xlsx,.xls" id="contained-button-file" onChange={handleFileUpload}/>
            </Grid >

          <Card>
          <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Descripción general</h4>
              <p className={classes.cardCategoryWhite}>Algoritmo</p>
              
          </CardHeader>
            <CardBody>
              
            <div className={classes.typo}>
              <p>
                
            Las medidas de distancia entre poblaciones y dentro de poblaciones, 
            han sido ampliamente utilizadas en numerosos campas científicos: antropología, agricultura, biología, genética, economía, 
            lingiiística, psicología, sociología, etc. La noción de distancia estadística junto con sus propiedades constituyen una importante 
            herramienta, tanto en la estadística matemática como en el análisis de datos. 
              </p>
              <p>
              Se da, en general, el nombre de distancia o disimilaridad entre dos individuos i y j a una medida, indicada por d(i,j) , 
              que mide el grado de semejanza, o a mejor decir de desemejanza, entre ambos objetos o individuos, en relación a un cierto número
               de características cuantitativa y / o cualitativas. El valor de d(i,j) es siempre un valor no negativo, y cuanto mayor sea este 
               valor mayor será la diferencia entre los individuos i y j.
              </p>
            </div>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={12} md={12}>
        <CustomTabs
            headerColor="danger"
            tabs={[
              {
                tabName: "Euclidianas",
                 tabContent: (
                  <Table
                  tableHeaderColor="primary"
                  tableHead={distEuclidiana.map((x,i,array)=>{return "Elem"+(i+1).toString()})}
                  tableData={distEuclidiana}
                  />  
                )
              },
              {
                tabName: "Chebyshev",
             
                tabContent: (
                  <Table
                  tableHeaderColor="primary"
                  tableHead={distChebyshev.map((x,i,array)=>{return "Elem"+(i+1).toString()})}
                  tableData={distChebyshev}
                  />  
                )
              },
              {
                tabName: "Manhattan",
                
                tabContent: (
                  <Table
                  tableHeaderColor="primary"
                  tableHead={distManhattan.map((x,i,array)=>{return "Elem"+(i+1).toString()})}
                  tableData={distManhattan}
                  />  
                )
              },
              {
                tabName: "Minkowsky",
                
                tabContent: (
                  <>
                   <TextField
                        label="Lambda"
                        value={p}
                        onChange={handleChange}
                       
                      />
                  {/* <CustomInput
                    labelText="Lambda"
                    value = {p}
                    formControlProps={{
                      
                    }}
                    
                    // inputProps= {{
                    //   inputComponent: NumberFormatCustom,
                    // }}
                    onChange={handleChange}
                  /> */}
                
                
                  <Table
                  tableHeaderColor="primary"
                  tableHead={distMinkowsky.map((x,i,array)=>{return "Elem"+(i+1).toString()})}
                  tableData={distMinkowsky}
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
