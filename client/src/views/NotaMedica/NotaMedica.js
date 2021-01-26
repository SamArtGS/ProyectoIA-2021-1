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
import CardAvatar from "components/Card/CardAvatar.js";
import avatar from "assets/img/faces/marc.jpg";
import LogisticRegression from 'helpers/logreg.js';
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Warning from "@material-ui/icons/Warning";

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
const { Matrix } = require('ml-matrix');

export default NotaMedica => {
    const classes = useStyles();
    const [columns, setColumns] = useState([]);
    const [header, setHeaders] = useState([]);
    const [data, setData] = useState([]);
    const [raw,setRaw] = useState('');
    const [result,setResults] = useState([]);
    const [tc, setTC] = React.useState(false);
    const [nombre,setNombre] = useState('');
    const [apPaterno,setApPaterno] = useState('');
    const [apMaterno,setApMaterno] = useState('');
    const [edad,setEdad] = useState('20');
    const [sexo,setSexo] = useState('Masculino');
    const [peso,setPeso] = useState('60');
    const [estatura,setEstatura] = useState('180');
    const [FC,setFC] = useState('');
    const [FR,setFR] = useState('');
    const [tr, setTR] = React.useState(false);
    const [resultado, setResultado] = useState([]);
    //Datos Tumor

    const [radio, setRadio] = useState('0.5');
    const [textura, setTextura] = useState('0.4');
    const [perimetro, setPerimetro] = useState('0.4');
    const [area, setArea] = useState('0.3');
    const [suavidad, setSuavidad] = useState('0.3');
    const [compacidad, setCompacidad] = useState('0.2');
    const [concavidad, setConcavidad] = useState('0.2');
    const [pconcavos, setPConcavos] = useState('0.1');
    const [simetria, setSimetria] = useState('0.1');
    const [dimFrac, setDimFrac] = useState('0.01');

    // Proceso de Data
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
      handleAnalizar(list);
    }
  
// Función para subir datos
const handleFileUpload = e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    /* Parsear data */
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: 'binary' });
    /* Obtener por renglón*/
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convertirlo en Array de Arrays */
    const datos = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    setRaw(datos);
    processData(datos);
  };
  reader.readAsBinaryString(file);
}

const [modelo, setModelo] = useState({});
const [error, setError] = useState("");

const handleChecarResutado = (event) => {

  if (typeof data !== 'undefined' && data.length > 0){

  const X_test = new Matrix([[
    parseFloat(radio),
    parseFloat(textura),
    parseFloat(perimetro),
    parseFloat(area),
    parseFloat(suavidad),
    parseFloat(compacidad),
    parseFloat(concavidad),
    parseFloat(pconcavos),
    parseFloat(simetria),
    parseFloat(dimFrac)
  ]]);

  console.log(modelo);

  console.log("La predicción es:",modelo.predict(X_test));
  console.log("El learning rate es:",modelo.learningRate);
  console.log("Clasificadores: ",modelo.classifiers);
  console.log("Clases:",modelo.numberClasses);
  console.log("Pesos:",modelo.weights);

  setResultado(modelo.predict(X_test));
  }else{
    setTR(true);
          setTimeout(() => {
            setTR(false);
          }, 6000);
  }

}

const handleAnalizar = (dataset) => {
  if (typeof dataset !== 'undefined' && dataset.length > 0){
  setError("");
  let datos = ((dataset[0].map((_, c) => dataset.map(r => r[c]))).slice(2,12).map((x,i,a) => {return x.map(num => Number(num)) }))
  console.log((datos[0].map((_, c) => datos.map(r => r[c]))));
  console.log((dataset[0].map((_, c) => dataset.map(r => r[c]))).slice(1,2)[0].map((x,i,a) => x=='M' ? 1 : 0));
  const X_train = new Matrix((datos[0].map((_, c) => datos.map(r => r[c]))));
  const Y_train = Matrix.columnVector((dataset[0].map((_, c) => dataset.map(r => r[c]))).slice(1,2)[0].map((x,i,a) => x=='M' ? 1 : 0));


  console.log("MAtriz Xtrain:",X_train);
  console.log("Matriz Ytrain:",Y_train);

  const logreg = new LogisticRegression({ numSteps: 2000, learningRate: 0.003 });
  logreg.train(X_train,Y_train);

  setModelo(logreg);
  
  }else{
    setTR(true);
          setTimeout(() => {
            setTR(false);
          }, 6000);
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
            <input aligh="right" className={classes.input} type="file" accept=".csv,.xlsx,.xls" id="contained-button-file" onChange={handleFileUpload}/>
              
            </Grid >
          </GridItem>
          
          <GridItem xs={12} sm={12} md={12}>
          <Card profile>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Datos del paciente</h4>
              <p className={classes.cardCategoryWhite}>Por favor, ingresa los datos que tiene su paciente</p>
              
          </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                <TextField
                        label="Nombre (s)"
                        value={nombre}
                        onChange={ (event) => {setNombre(event.target.value)}}
                        labelWidth={20}
                        fullWidth
                      />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                <TextField
                        label="Apellido Paterno"
                        value={apPaterno}
                        onChange={(event) => {setApPaterno(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                  />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                <TextField
                        label="Apellido Materno"
                        value={apMaterno}
                        onChange={(event) => {setApMaterno(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                  />
                  
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={4} sm={2} md={3}>
                <TextField
                        label="Edad"
                        value={edad}
                        onChange={(event) => {setEdad(event.target.value)}}
                        labelWidth={20}
                        fullWidth
                        numeric
                        inputProps={{ inputMode: 'numeric'}}
                      />
                </GridItem>
                <GridItem xs={4} sm={2} md={3}>
                <TextField
                        label="Sexo"
                        value={sexo}
                        onChange={(event) => {setSexo(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Peso (kg)"
                        value={peso}
                        onChange={(event) => {setPeso(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        numeric
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Estatura(cm)"
                        value={estatura}
                        onChange={(event) => {setEstatura(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        numeric
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="FC"
                        value={FC}
                        onChange={(event) => {setFC(event.target.value)}}
                        labelWidth={20}
                        fullWidth
                        inputProps={{ inputMode: 'numeric' }}
                      />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="FR"
                        value={FR}
                        onChange={(event) => {setFR(event.target.value)}}
                        labelWidth={20}
                        fullWidth
                        inputProps={{ inputMode: 'numeric' }}
                      />
                </GridItem>
                
              </GridContainer>
              <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <h3>Datos del tumor</h3>
                </GridItem>
                
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Radio"
                        value={radio}
                        onChange={(event) => {setRadio(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Textura"
                        value={textura}
                        onChange={(event) => {setTextura(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />  
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Perímetro"
                        value={perimetro}
                        onChange={(event) => {setPerimetro(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                  
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Área"
                        value={area}
                        onChange={(event) => {setArea(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Suavidad"
                        value={suavidad}
                        onChange={(event) => {setSuavidad(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Compacidad"
                        value={compacidad}
                        onChange={(event) => {setCompacidad(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Concavidad"
                        value={concavidad}
                        onChange={(event) => {setConcavidad(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="P.Cóncavos"
                        value={pconcavos}
                        onChange={(event) => {setPConcavos(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Simetría"
                        value={simetria}
                        onChange={(event) => {setSimetria(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>
                <GridItem xs={4} sm={3} md={3}>
                <TextField
                        label="Dim.Frac."
                        value={dimFrac}
                        onChange={(event) => {setDimFrac(event.target.value)}}
                        labelWidth={10}
                        fullWidth
                        inputProps={{ inputMode: 'decimal' }}
                  />
                </GridItem>

              </GridContainer>
              <br></br>
              <br></br>
              <GridContainer >
                <GridItem xs={12} sm={12} md={12}>
                <Button color="primary" round onClick={handleChecarResutado}>
                Analizar
              </Button>
              <Snackbar
                  place="tr"
                  color="warning"
                  icon={Warning}
                  message="No has insertado ningún dataset para el entrenamiento"
                  open={tr}
                  closeNotification={() => setTR(false)}
                  close
                />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>

      <GridItem xs={12} sm={12} md={12}>
      
        <Card profile>
        <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
          
            <CardBody profile>
              <h3 className={classes.cardTitle}> Diagnóstico</h3>
              <h4 className={classes.cardTitle}>{nombre + " " + apPaterno + " " + apMaterno}</h4>
              <h4 className={classes.cardTitle}>{edad + " años - " + (edad > 17 ? "Adulto": "Menor de edad")}</h4>
              <h4 className={classes.cardTitle}>{"IMC: " + (peso/((estatura/100)**2)).toFixed(2) + " - " + 
              (peso/((estatura/100)**2) < 18.5 ? "Desnutrido" 
              : peso/((estatura/100)**2) >18.5 && peso/((estatura/100)**2) 
              < 25 ? "Peso Normal" : "Sobrepeso") }</h4>

              <br>
              </br>
              <h5 className={classes.CardBody}>{"El Learning Rate es:" + modelo.learningRate}</h5>
              <br>
              </br>
              <br>
              </br>

              <h4 className={classes.cardTitle}>{"RESULTADO: " + (resultado[0]==0 ? "MALIGNO" : resultado[0]==1 ? "BENIGNO" : "")}</h4>
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
              tableData={data.slice(0,20)}
            />
          </CardBody>
        </Card>
      </GridItem>
      
    </GridContainer>
  );
}
