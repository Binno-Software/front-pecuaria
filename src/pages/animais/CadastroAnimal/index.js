import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Typography,
  Divider,
  TextField,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import api from 'src/service/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toastSuccess } from 'src/utils/toast';
import FazendaSelect from 'src/components/FazendaSelect';
import FotosAnimal from 'src/components/FotosAnimal';
import EstadoAtualSelect from 'src/components/EstadoAtualSelect';
import RacaAnimalSelect from 'src/components/RacaAnimalSelect';
import PesoAnimaList from 'src/components/PesoAnimalList';

const useStyles = makeStyles({
  root: {}
});

const initialState = {
  numero: '',
  raca: 'NELORE',
  apelido: '',
  dataNascimento: moment().format('YYYY-MM-DD'),
  pesos: [],
  dataPesagem: moment().format('YYYY-MM-DD'),
  numeroCria: 0,
  estadoAtual: 'VAZIA',
  dataUltimoParto: moment().format('YYYY-MM-DD'),
  isFemea: true,
  descarteFuturo: false,
  justificativaDescarteFuturo: '',
  imagens: []
};

const CadastroAnimais = ({ className, ...rest }) => {
  const classes = useStyles();
  const [fazenda, setFazenda] = useState({});
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setValues({
        id: state.id,
        numero: state.numero,
        raca: state.raca,
        apelido: state.apelido,
        dataNascimento: state.dataNascimento,
        pesos: state.pesos,
        dataPesagem: state.dataPesagem,
        numeroCria: state.numeroCria,
        estadoAtual: state.estadoAtual,
        dataUltimoParto: state.dataUltimoParto,
        descarteFuturo: state.descarteFuturo,
        isFemea: state.isFemea,
        justificativaDescarteFuturo: state.justificativaDescarteFuturo,
        imagens: state.imagens
      });
      setFazenda({
        id: state.fazenda.id,
        nome: state.fazenda.nome
      });
    }
  }, [state]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const addFazenda = useCallback(
    (_fazenda) => {
      setFazenda({
        id: _fazenda
      });
    },
    [setFazenda]
  );

  const add = useCallback(
    (valor) => {
      setValues({
        ...values,
        estadoAtual: valor
      });
    },
    [values]
  );

  const addRaca = useCallback(
    (valor) => {
      setValues({
        ...values,
        raca: valor
      });
    },
    [values]
  );

  const addPeso = useCallback(
    (peso) => {
      setValues({
        ...values,
        pesos: [...values.pesos, peso]
      });
    },
    [values]
  );

  const removerPeso = useCallback(
    (id) => {
      setValues({
        ...values,
        pesos: [values.pesos.filter((peso) => peso.id !== id)]
      });
    },
    [values]
  );

  const addImagem = useCallback(
    (image) => {
      setValues({
        ...values,
        imagens: [...values.imagens, image]
      });
    },
    [values]
  );

  const removerImagem = useCallback(
    (url) => {
      setValues({
        ...values,
        imagens: values.imagens.filter((imagem) => imagem.imagemUrl !== url)
      });
    },
    [values]
  );

  const create = useCallback(() => {
    api
      .post('animais', {
        numero: values.numero,
        raca: values.raca,
        apelido: values.apelido,
        dataNascimento: values.dataNascimento,
        pesos: values.pesos,
        dataPesagem: values.dataPesagem,
        numeroCria: values.numeroCria,
        estadoAtual: values.estadoAtual,
        dataUltimoParto: values.dataUltimoParto,
        descarteFuturo: values.descarteFuturo,
        isFemea: values.isFemea,
        justificativaDescarteFuturo: values.justificativaDescarteFuturo,
        fazenda,
        imagens: values.imagens
      })
      .then(() => {
        toastSuccess('Animal cadastrado com sucesso');
        initialState.numero = Number(values.numero) + 1;
        setValues(initialState);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    setLoading(true);
  }, [values, fazenda]);

  const update = useCallback(() => {
    api
      .put('animais', {
        id: values.id,
        numero: values.numero,
        raca: values.raca,
        apelido: values.apelido,
        dataNascimento: values.dataNascimento,
        pesos: values.pesos,
        dataPesagem: values.dataPesagem,
        numeroCria: values.numeroCria,
        estadoAtual: values.estadoAtual,
        dataUltimoParto: values.dataUltimoParto,
        descarteFuturo: values.descarteFuturo,
        isFemea: values.isFemea,
        justificativaDescarteFuturo: values.justificativaDescarteFuturo,
        fazenda,
        imagens: values.imagens
      })
      .then(() => {
        toastSuccess('Animal atualizado com sucesso');
        navigate('../../animais');
      });
  }, [values, fazenda, navigate]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <form className={clsx(classes.root, className)} {...rest}>
      <Card>
        <CardHeader subheader="inserindo novo animal" title="Animal" />
        <Divider />
        <CardContent>
          <FazendaSelect addFazenda={addFazenda} />
          <TextField
            fullWidth
            label="Número do animal"
            margin="normal"
            name="numero"
            onChange={handleChange}
            type="number"
            value={values.numero}
            variant="outlined"
          />
          <Box alignItems="center" display="flex" ml={-1}>
            <Checkbox
              checked={values.isFemea}
              name="isFemea"
              onChange={() => {
                const event = {
                  target: {
                    name: 'isFemea',
                    value: !values.isFemea
                  }
                };

                handleChange(event);
              }}
            />
            <Typography color="textSecondary" variant="body1">
              Fêmea
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Apelido do animal"
            margin="normal"
            name="apelido"
            onChange={handleChange}
            type="text"
            value={values.apelido}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Data de nascimento"
            margin="normal"
            name="dataNascimento"
            onChange={handleChange}
            type="date"
            value={values.dataNascimento}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
          />
          <PesoAnimaList
            statePesos={values.pesos}
            addPeso={addPeso}
            removerPeso={removerPeso}
          />
          {values.isFemea && (
            <>
              <TextField
                fullWidth
                label="Número de crias"
                margin="normal"
                name="numeroCria"
                onChange={handleChange}
                type="number"
                value={values.numeroCria}
                variant="outlined"
              />
              <EstadoAtualSelect add={add} />
              <TextField
                fullWidth
                label="Data do último parto"
                margin="normal"
                name="dataUltimoParto"
                placeholder=""
                onChange={handleChange}
                type="date"
                value={values.dataUltimoParto}
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </>
          )}
          <RacaAnimalSelect add={addRaca} />
          <Box alignItems="center" display="flex" ml={-1}>
            <Checkbox
              checked={values.descarteFuturo}
              name="descarteFuturo"
              onChange={() => {
                const event = {
                  target: {
                    name: 'descarteFuturo',
                    value: !values.descarteFuturo
                  }
                };

                handleChange(event);
              }}
            />
            <Typography color="textSecondary" variant="body1">
              Descarte futuro
            </Typography>
          </Box>
          {values.descarteFuturo && (
            <TextField
              fullWidth
              label="Justificativa para o descarte"
              margin="normal"
              name="justificativaDescarteFuturo"
              onChange={handleChange}
              type="text"
              value={values.justificativaDescarteFuturo}
              variant="outlined"
              multiline
            />
          )}
        </CardContent>
        <Divider />
        <FotosAnimal
          stateImagens={values.imagens}
          addImagem={addImagem}
          removerImagem={removerImagem}
          setLoadingImage={setLoadingImage}
        />
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={values.id ? update : create}
            disabled={loadingImage}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

CadastroAnimais.propTypes = {
  className: PropTypes.string
};

export default CadastroAnimais;
