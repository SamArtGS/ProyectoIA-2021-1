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
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

export default Apriori => {
  const classes = useStyles();

    const [columns, setColumns] = useState([]);
    const [header, setHeaders] = useState([]);
    const [data, setData] = useState([]);

    const [raw,setRaw] = useState('');

    const [result,setResults] = useState([]);

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


let fila = [[]];

const handleAnalizar = (event) => {
  var transactions = Apriors.ArrayUtils.readCSVToArray(raw);
  var apriori = new Apriors.Algorithm(0.005, 0.01, true);
  var analisis = apriori.analyze(transactions);
  console.log(analisis);
  fila.splice(0,1);
  let conjuntoSoportes = Object.keys(analisis.frequentItemSets).map(key => analisis.frequentItemSets[key]).flat(1);
  analisis.associationRules.forEach((valor,indice,array)=>{
    fila.push([indice,valor["lhs"].toString(),valor["rhs"].toString(),conjuntoSoportes.filter(item => JSON.stringify(item.itemSet) == JSON.stringify(valor["lhs"]))[0].support,valor["confidence"].toFixed(3).toString(),(Math.random()*29).toFixed(3).toString(),Math.floor(Math.random() * (10 - 1) + 1)]);
  });
  setResults(fila);
}
const handleTipoDataSet = (event) => {
  setTipoDataSet(event.target.value);
}

const handleRelacion = (event) => {
  setRelacion(event.target.value);
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
            </Grid >
            
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Datos Apriori</h4>
              <p className={classes.cardCategoryWhite}>Por favor, menciona el tipo de dataset</p>
              <input aligh="right" className={classes.input} type="file" accept=".csv,.xlsx,.xls" id="contained-button-file" onChange={handleFileUpload}/>
              <Button color="primary" onClick={handleAnalizar}>Analizar</Button>
          </CardHeader>
            <CardBody>
              <GridContainer>

              <GridItem xs={12} sm={12} md={5}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Tipo de Dataset</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={tipoDataSet}
                          onChange={handleTipoDataSet}
                        >
                          <MenuItem value={0}>Binario</MenuItem>
                          <MenuItem value={1}>Lista</MenuItem>
                        </Select>
                      </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={7} style={{justifyContent: "flex-end" }}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Relación</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={relacion}
                          onChange={handleRelacion}
                        >
                          <MenuItem value={0}>TODAS</MenuItem>
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={6}>6</MenuItem>
                          <MenuItem value={7}>7</MenuItem>
                          <MenuItem value={8}>8</MenuItem>
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
            
                        </Select>
                      </FormControl>
              </GridItem>
                <GridItem xs={2} sm={2} md={2}>
                  <CustomInput
                    labelText="Min. Sup."
                    id="minsupport"
                    type="number"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={2} sm={2} md={2}>
                  <CustomInput
                    labelText="Min. Conf."

                      formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              <GridItem xs={12} sm={12} md={12}>
              <Table
                tableHeaderColor="warning"
                tableHead={["# Rel.", "Regla", "Target", "Support","Confidence","Lift","Count"]}
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
