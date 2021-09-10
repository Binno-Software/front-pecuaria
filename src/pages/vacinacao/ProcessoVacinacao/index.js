import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  makeStyles,
  LinearProgress,
  TextField,
  Card,
  Grid,
  Paper,
  Button,
  Tab,
  Tabs
} from '@material-ui/core';
import Page from 'src/components/Page';
import api from 'src/service/api';
import EmptyData from 'src/components/EmptyData';
import GridAnimaisSelecionados from './GridAnimaisSelecionados';
import GridAnimais from './GridAnimais';
import FazendaSelect from 'src/components/FazendaSelect';
import MedicamentoSelect from 'src/components/MedicamentoSelect';
import { toastSuccess } from 'src/utils/toast';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProcessoVacinacao = () => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [fazenda, setFazenda] = useState({});
  const [medicamento, setMedicamento] = useState({});
  const [tab, setTab] = useState(0);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('animais', {
      params: {
        size: limit,
        page,
        fazenda: fazenda.id
      }
    }).then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }, [limit, page, fazenda.id]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const reload = useCallback((_limit, offset) => {
    setLoading(true);
    setLimit(_limit);
    setPage(offset);
  }, []);

  const addAnimal = useCallback((data) => {
    if (data instanceof Array) {
      setAnimaisSelecionados(data);
      return;
    }

    setAnimaisSelecionados([data, ...animaisSelecionados]);
  }, [animaisSelecionados]);

  const addFazenda = useCallback(
    (_fazenda) => {
      setFazenda({
        id: _fazenda
      });
    },
    [setFazenda]
  );

  const addMedicamento = useCallback(
    (_medicamento) => {
      setMedicamento({
        id: _medicamento
      });
    },
    [setMedicamento]
  );

  const iniciarProcesso = useCallback(() => {
    api.post('vacinacao', {
      medicamentoId: medicamento.id,
      animaisId: animaisSelecionados.map(animal => animal.id)
    }).then(() => {
      toastSuccess('Processo de vacinação criado com sucesso');
      navigate('../../animais');
    });
  }, [medicamento, animaisSelecionados, navigate]);

  if (loading) return <LinearProgress />;

  return (
    <Page
      className={classes.root}
      title="Vacinação"
    >
      <Container maxWidth={false}>

        <Card>

          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <FazendaSelect fazendaSelected={fazenda.id} addFazenda={addFazenda} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <TextField
                    fullWidth
                    label="Estado do animal"
                    name="selecionado"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.selecionado}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>
                  <TextField
                    label="Numero inicial"
                    margin="normal"
                    name="numeroInicial"
                    onChange={handleChange}
                    type="text"
                    value={values.numeroInicial}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>
                  <TextField
                    label="Numero final"
                    margin="normal"
                    name="numeroFinal"
                    onChange={handleChange}
                    type="text"
                    value={values.numeroFinal}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>
                  <TextField
                    label="Numero específico"
                    margin="normal"
                    name="numeroInicial"
                    onChange={handleChange}
                    type="text"
                    value={values.numeroInicial}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>
                  <TextField
                    label="Idade em dias"
                    margin="normal"
                    name="numeroInicial"
                    onChange={handleChange}
                    type="text"
                    value={values.numeroInicial}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <MedicamentoSelect medicamentoSelected={medicamento.id} addMedicamento={addMedicamento} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={iniciarProcesso}
                  >
                    Medicar
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Card>

        {data.content.length > 0 ? (
          <>
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
              <Tab label="animais" {...a11yProps(0)} />
              <Tab label="animais selecionados" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={tab} index={0}>
              <Box mt={3}>
                <GridAnimais addAnimal={addAnimal} data={data} reload={reload} page={page} limit={limit} />
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Box mt={3}>
                <GridAnimaisSelecionados data={animaisSelecionados} />
              </Box>
            </TabPanel>
          </>
        ) : (
          <EmptyData />
        )}
      </Container>
    </Page>
  );
};

export default ProcessoVacinacao;
