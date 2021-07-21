import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import api from 'src/service/api';
import { useLocation } from 'react-router-dom';
import { toastSuccess } from 'src/utils/toast';
import EstadoAtualSelect from './EstadoAtualSelect';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroAnimais = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    numero: 0,
    raca: '',
    apelido: '',
    dataNascimento: new Date(),
    numeroCrias: 0,
    estadoAtual: 'VAZIA',
    dataUltimoParto: new Date(),
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
        numeroCrias: state.numeroCrias,
        estadoAtual: state.estadoAtual,
        dataUltimoParto: state.dataUltimoParto,
        descarteFuturo: false,
        justificativaDescarteFuturo: state.justificativaDescarteFuturo
      })
    }

  }, [state])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

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
      numeroCrias: values.numeroCrias,
      estadoAtual: values.estadoAtual,
      dataUltimoParto: values.dataUltimoParto,
      descarteFuturo: false,
      justificativaDescarteFuturo: values.justificativaDescarteFuturo
    }).then(() => {
      toastSuccess('Animal cadastrado com sucesso')
      setValues({
        numero: Number(values.numero) + 1,
        raca: values.raca,
        apelido: '',
        dataNascimento: values.dataNascimento,
        numeroCrias: values.numeroCrias,
        estadoAtual: values.estadoAtual,
        dataUltimoParto: values.dataUltimoParto,
        descarteFuturo: false,
        justificativaDescarteFuturo: values.justificativaDescarteFuturo
      })
      setLoading(false)
    }).catch(() => setLoading(false))

    setLoading(true)
  }, [values, isUpdate, updateForm])

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
          <TextField
            fullWidth
            label="numero"
            margin="normal"
            name="numero"
            onChange={handleChange}
            type="number"
            value={values.numero}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="raca"
            margin="normal"
            name="raca"
            onChange={handleChange}
            type="text"
            value={values.raca}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="apelido"
            margin="normal"
            name="apelido"
            onChange={handleChange}
            type="text"
            value={values.apelido}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="dataNascimento"
            margin="normal"
            name="dataNascimento"
            onChange={handleChange}
            type="date"
            value={values.dataNascimento}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="numeroCrias"
            margin="numeroCrias"
            name="dataNascimento"
            onChange={handleChange}
            type="number"
            value={values.numeroCrias}
            variant="outlined"
          />
          <EstadoAtualSelect add={add}/>
          <TextField
            fullWidth
            label="dataUltimoParto"
            margin="normal"
            name="dataUltimoParto"
            placeholder=""
            onChange={handleChange}
            type="date"
            value={values.dataUltimoParto}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="justificativaDescarteFuturo"
            margin="normal"
            name="justificativaDescarteFuturo"
            onChange={handleChange}
            type="text"
            value={values.justificativaDescarteFuturo}
            variant="outlined"
            multiline={true}
          />
        </CardContent>
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
