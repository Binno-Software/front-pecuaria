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
import FazendaSelect from 'src/components/FazendaSelect';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroFuncionario = ({ className, ...rest }) => {
  const classes = useStyles();
  const [fazenda, setFazenda] = useState({})
  const [values, setValues] = useState({
    nome: '',
    cargo: '',
    rg: '',
    cpf: ''
  });
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      setIsUpdate(true)
      setValues({
        nome: state.nome,
        cargo: state.cargo,
        rg: state.rg,
        cpf: state.cpf,
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

    api.post('funcionarios', {
      nome: values.nome,
      cargo: values.cargo,
      rg: values.rg,
      cpf: values.cpf,
      fazenda
    }).then(() => {
      toastSuccess('Funcionario cadastrado com sucesso')
      setValues({
        nome: '',
        cargo: '',
        rg: '',
        cpf: '',
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
          subheader="inserindo novo funcionario"
          title="Funcionario"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Nome"
            margin="normal"
            name="nome"
            onChange={handleChange}
            type="text"
            value={values.nome}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Cargo"
            margin="normal"
            name="cargo"
            onChange={handleChange}
            type="text"
            value={values.cargo}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="RG"
            margin="normal"
            name="rg"
            onChange={handleChange}
            type="text"
            value={values.rg}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="CPF"
            margin="normal"
            name="cpf"
            onChange={handleChange}
            type="text"
            value={values.cpf}
            variant="outlined"
          />
        </CardContent>
        <FazendaSelect addFazenda={addFazenda} />
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

CadastroFuncionario.propTypes = {
  className: PropTypes.string
};

export default CadastroFuncionario;
