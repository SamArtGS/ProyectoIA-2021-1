import React,{useState} from "react";
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
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

var Apriors = require('apriori');
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
    margin: 1,
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

export default RegresionLog => {
  const classes = useStyles();

    const [columns, setColumns] = useState([]);
    const [header, setHeaders] = useState([]);
    const [data, setData] = useState([]);
    const [raw,setRaw] = useState('');
    const [result,setResults] = useState([]);
    const [soporte,setSoporte] = useState(0.1);
    const [confianza,setConfianza] = useState(0.1);


    // aversi sale
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
      setHeaders(headers);
      setData(list);
      setColumns(columns);
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
    setRaw(datos);
    processData(datos);
  };

  reader.readAsBinaryString(file);
}


const [tipoDataSet, setTipoDataSet] = useState('');
const [relacion, setRelacion] = useState('');


let fila = [];

const handleAnalizar = (event) => {
  var transactions = Apriors.ArrayUtils.readCSVToArray(raw);
  var apriori = new Apriors.Algorithm(soporte, confianza, true);
  var analisis = apriori.analyze(transactions);
  console.log(analisis);
  fila.splice(0,1);
  let conjuntoSoportes = Object.keys(analisis.frequentItemSets).map(key => analisis.frequentItemSets[key]).flat(1);
  analisis.associationRules.forEach( (valor,indice,array)=>{
    fila.push([
      indice,
      valor["lhs"].toString(),
      valor["rhs"].toString(),
      conjuntoSoportes.filter(item => JSON.stringify(item.itemSet) == JSON.stringify(valor["lhs"]))[0].support.toFixed(5),
      valor["confidence"].toFixed(5).toString(),
      (valor["confidence"].toFixed(5).toString()/conjuntoSoportes.filter(item => JSON.stringify(item.itemSet) == JSON.stringify(valor["rhs"]))[0].support).toFixed(5).toString(),
      Math.floor(Math.random() * (10 - 1) + 1)]);
  });
  setResults(fila);
}
const handleTipoDataSet = (event) => {
  setTipoDataSet(event.target.value);
}

const handleRelacion = (event) => {
  setRelacion(event.target.value);
}

const handleChangeSoporte = (event) => {
  setSoporte(event.target.value);
}

const handleChangeConfianza = (event) => {
  setConfianza(event.target.value);
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
            <input aligh="right" className={classes.input} type="file" accept=".csv,.xlsx,.xls" id="contained-button-file" onChange={handleFileUpload}/>
              <Button color="danger" onClick={handleAnalizar}>Analizar</Button>
            </Grid >
          </GridItem>

          <GridItem xs={12} sm={12} md={12}>
            <Card color="warning">
            <CardHeader color="warning">
            <h4 className={classes.cardTitleWhite}>Descripción general</h4>
              <p className={classes.cardCategoryWhite}>Algoritmo</p>
              </CardHeader>
              <CardBody>
              <div className={classes.typo}>
              <p>
              Los algoritmos de reglas de asociación tienen como objetivo encontrar relaciones dentro un conjunto de transacciones, en concreto, items o atributos que tienden a ocurrir de forma conjunta. 
              En este contexto, el término transacción hace referencia a cada grupo de eventos que están asociados de alguna forma.
              </p>
              <p>
              Se inicia identificando los items individuales que aparecen en el total de transacciones con una frecuencia por encima de un mínimo establecido por el usuario. 
              A continuación, se sigue una estrategia bottom-up en la que se extienden los candidatos añadiendo un nuevo item y se eliminan aquellos que contienen un subconjunto infrecuente o 
              que no alcanzan el soporte mínimo. Este proceso se repite hasta que el algoritmo no encuentra más ampliaciones exitosas de los itemsets previos o cuando se alcanza un tamaño máximo. 
              Se procede a identificar los itemsets frecuentes y, a partir de ellos, crear reglas de asociación.
              </p>
            </div>
            </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}>Tabla datos apriori</h4>
              <p className={classes.cardCategoryWhite}>Por favor, menciona el tipo de dataset</p>
              
          </CardHeader>
            <CardBody>
              <GridContainer>

            
                <GridItem xs={4} sm={2} md={2}>
                <TextField
                        label="Min. Soporte"
                        value={soporte}
                        onChange={handleChangeSoporte}
                       
                      />
                </GridItem>
                <GridItem xs={4} sm={2} md={2}>
                <TextField
                        label="Min. Confianza"
                        value={confianza}
                        onChange={handleChangeConfianza}
                       
                      />
                </GridItem>
              <GridItem xs={12} sm={12} md={12}>
              <Table
                tableHeaderColor="warning"
                tableHead={["# Rel.", "Regla", "Target", "Soporte","Confianza","Lift","Cuenta"]}
                tableData={result}
                />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
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
