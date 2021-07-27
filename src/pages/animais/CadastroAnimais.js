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
import EstadoAtualSelect from './EstadoAtualSelect';
import FazendaSelect from 'src/components/FazendaSelect';
import AnimalFoto from './FotoAnimal';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroAnimais = ({ className, ...rest }) => {
  const classes = useStyles();
  const [fazenda, setFazenda] = useState({})
  const [values, setValues] = useState({
    numero: '',
    raca: '',
    apelido: '',
    dataNascimento: moment().format("YYYY-MM-DD"),
    numeroCria: 0,
    estadoAtual: 'VAZIA',
    dataUltimoParto: moment().format("YYYY-MM-DD"),
    isFemea: true,
    descarteFuturo: false,
    justificativaDescarteFuturo: ''
  });
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      setIsUpdate(true)
      setValues({
        numero: state.numero,
        raca: state.raca,
        apelido: state.apelido,
        dataNascimento: state.dataNascimento,
        numeroCria: state.numeroCria,
        estadoAtual: state.estadoAtual,
        dataUltimoParto: state.dataUltimoParto,
        descarteFuturo: state.descarteFuturo,
        isFemea: state.isFemea,
        justificativaDescarteFuturo: state.justificativaDescarteFuturo
      })
      setFazenda({
        id: state.fazenda.id,
        nome: state.fazenda.nome
      })
    }

  }, [state])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const addFazenda = useCallback((fazenda) => {
    setFazenda({
      id: fazenda
    })
  }, [setFazenda])

  const add = useCallback((valor) => {
    setValues({
      ...values,
      estadoAtual: valor,
    })
  }, [values])

  const updateForm = useCallback(() => {
    api.put(`produto/${values.id}`, {
      nome: values.nome,
      ca: values.ca,
      estoque: values.estoque,
      valorVenda: values.valorVenda,
      valorCompra: values.valorCompra
    }).then(() => {
      toastSuccess('Produto alterado com sucesso')
      setValues({
        nome: '',
        ca: '',
        estoque: 0,
        valorVenda: 0,
        valorCompra: 0
      })
      setLoading(false)
      setIsUpdate(false)
    })

    setLoading(true)
  }, [values])

  const submitForm = useCallback(() => {
    if (isUpdate) {
      return updateForm()
    }

    api.post('animais', {
      numero: values.numero,
      raca: values.raca,
      apelido: values.apelido,
      dataNascimento: values.dataNascimento,
      numeroCria: values.numeroCria,
      estadoAtual: values.estadoAtual,
      dataUltimoParto: values.dataUltimoParto,
      descarteFuturo: values.descarteFuturo,
      isFemea: values.isFemea,
      justificativaDescarteFuturo: values.justificativaDescarteFuturo,
      fazenda
    }).then(() => {
      toastSuccess('Animal cadastrado com sucesso')
      setValues({
        numero: Number(values.numero) + 1,
        raca: values.raca,
        apelido: '',
        dataNascimento: values.dataNascimento,
        numeroCria: 0,
        estadoAtual: values.estadoAtual,
        dataUltimoParto: values.dataUltimoParto,
        descarteFuturo: false,
        justificativaDescarteFuturo: values.justificativaDescarteFuturo
      })
      setLoading(false)
    }).catch(() => setLoading(false))

    setLoading(true)
  }, [values, isUpdate, updateForm, fazenda])

  if (loading) {
    return <LinearProgress />
  }

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="inserindo novo animal"
          title="Animal"
        />
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
          <Box
            alignItems="center"
            display="flex"
            ml={-1}
          >
            <Checkbox
              checked={values.isFemea}
              name="isFemea"
              onChange={() => {
                const event = {
                  target: {
                    name: 'isFemea',
                    value: !values.isFemea
                  }
                }

                handleChange(event)
              }}
            />
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Fêmea
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Raça"
            margin="normal"
            name="raca"
            onChange={handleChange}
            type="text"
            value={values.raca}
            variant="outlined"
          />
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
              shrink: true,
            }}
          />{
            (values.isFemea &&
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
            )
          }
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
              shrink: true,
            }}
          />
          <Box
            alignItems="center"
            display="flex"
            ml={-1}
          >
            <Checkbox
              checked={values.descarteFuturo}
              name="descarteFuturo"
              onChange={() => {
                const event = {
                  target: {
                    name: 'descarteFuturo',
                    value: !values.descarteFuturo
                  }
                }

                handleChange(event)
              }}
            />
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Descarte futuro
            </Typography>
          </Box>
          {
            values.descarteFuturo && (
              <TextField
                fullWidth
                label="Justificativa para o descarte"
                margin="normal"
                name="justificativaDescarteFuturo"
                onChange={handleChange}
                type="text"
                value={values.justificativaDescarteFuturo}
                variant="outlined"
                multiline={true}
              />
            )
          }
        </CardContent>
        <Divider />
        <AnimalFoto />
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={submitForm}
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
