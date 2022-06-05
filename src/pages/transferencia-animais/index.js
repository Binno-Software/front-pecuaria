import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  makeStyles,
  TextField,
  Card,
  Grid,
  Paper,
  Button,
  Tab,
  Tabs,
  Typography,
  Checkbox
} from '@material-ui/core';
import Page from 'src/components/Page';
import api from 'src/service/api';
import EmptyData from 'src/components/EmptyData';
import GridAnimaisSelecionados from './GridAnimaisSelecionados';
import GridAnimais from './GridAnimais';
import FazendaSelect from 'src/components/FazendaSelect';
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

function TransferenciaAnimais() {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [data, setData] = useState({
    content: []
  });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const [fazenda, setFazenda] = useState({});
  const [fazendaDestino, setFazendaDestino] = useState({});
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('animais', {
      params: {
        size: limit,
        page,
      }
    }).then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }, [limit, page]);

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

  const addFazendaDestino = useCallback(
    (_fazenda) => {
      setFazendaDestino({
        id: _fazenda
      });
    },
    [setFazendaDestino]
  );

  const filtrarPesquisa = useCallback(() => {
    setLoading(true);
    const filter = {
      numero: values.numeroEspecifico || null,
      numeroInicial: values.numeroInicial || null,
      numeroFinal: values.numeroFinal || null,
      size: limit,
      page,
    };

    api.get('animais', { params: filter }).then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }, [values, limit, page]);

  const iniciarProcesso = useCallback(() => {
    setLoading(true);
    api.post('animais/transferencia-entre-fazendas', {
      fazendaOrigemId: Number(fazenda.id),
      fazendaDestinoId: Number(fazendaDestino.id),
      todosOsAnimais: values.todosOsAnimais || false,
      animaisSelecionadosId: animaisSelecionados.map(animal => animal.id)
    }).then(() => {
      toastSuccess('Processo de transferencia iniciado');
      navigate('../dashboard')
    });
  }, [fazenda, fazendaDestino, values, animaisSelecionados, navigate])

  return (
    <Page
      className={classes.root}
      title="Transferencia de animais entre fazenda"
    >
      <Container maxWidth={false}>

        <Card>

          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <FazendaSelect overrideTitle="Fazenda origem" fazendaSelected={fazenda.id} addFazenda={addFazenda} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <FazendaSelect overrideTitle="Fazendo destino" fazendaSelected={fazendaDestino.id} addFazenda={addFazendaDestino} />
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
                    name="numeroEspecifico"
                    onChange={handleChange}
                    type="text"
                    value={values.numeroEspecifico}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>

                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                </Paper>
              </Grid>
              <Box alignItems="center" display="flex" ml={-1}>
                <Checkbox
                  checked={values.todosOsAnimais}
                  name="isFemea"
                  onChange={() => {
                    const event = {
                      target: {
                        name: 'todosOsAnimais',
                        value: !values.todosOsAnimais
                      }
                    };

                    handleChange(event);
                  }}
                />
                <Typography color="textSecondary" variant="body1">
                  Transferir todos
                </Typography>
              </Box>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={filtrarPesquisa}
                  >
                    Aplicar filtros
                  </Button>
                </Paper>
                <Paper className={classes.paper}>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={iniciarProcesso}
                  >
                    Transferir
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
                <GridAnimais loading={loading} addAnimal={addAnimal} data={data} reload={reload} page={page} limit={limit} />
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

export default TransferenciaAnimais;
