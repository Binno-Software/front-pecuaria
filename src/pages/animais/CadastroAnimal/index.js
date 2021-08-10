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
import { useLocation } from 'react-router-dom';
import { toastSuccess } from 'src/utils/toast';
import FazendaSelect from 'src/components/FazendaSelect';
import FotosAnimal from 'src/components/FotosAnimal';
import EstadoAtualSelect from 'src/components/EstadoAtualSelect';
import RacaAnimalSelect from 'src/components/RacaAnimalSelect';

const useStyles = makeStyles({
  root: {}
});

const initialState = {
  numero: '',
  raca: 'NELORE',
  apelido: '',
  dataNascimento: moment().format('YYYY-MM-DD'),
  peso: undefined,
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

  useEffect(() => {
    if (state) {
      setValues({
        numero: state.numero,
        raca: state.raca,
        apelido: state.apelido,
        dataNascimento: state.dataNascimento,
        peso: state.peso,
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

  const addImagem = useCallback(
    (url) => {
      setValues({
        ...values,
        imagens: [...values.imagens, url]
      });
    },
    [values]
  );

  const removerImagem = useCallback(
    (url) => {
      setValues({
        ...values,
        imagens: [values.imagens.filter((img) => img !== url)]
      });
    },
    [values]
  );

  const submitForm = useCallback(() => {
    api
      .post('animais', {
        numero: values.numero,
        raca: values.raca,
        apelido: values.apelido,
        dataNascimento: values.dataNascimento,
        peso: parseFloat(values.peso),
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
          <TextField
            fullWidth
            label="Peso do animal"
            margin="normal"
            name="peso"
            onChange={handleChange}
            type="number"
            value={values.peso}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Data pessagem"
            margin="normal"
            name="dataPesagem"
            onChange={handleChange}
            type="date"
            value={values.dataPesagem}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
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
          addImagem={addImagem}
          removerImagem={removerImagem}
          setLoadingImage={setLoadingImage}
        />
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={submitForm}
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
