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
import { useLocation, useNavigate } from 'react-router-dom';
import { toastSuccess } from 'src/utils/toast';
import FazendaSelect from 'src/components/FazendaSelect';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroFuncionario = ({ className, ...rest }) => {
  const classes = useStyles();
  const [fazenda, setFazenda] = useState({
    id: '',
    nome: ''
  });
  const [values, setValues] = useState({
    nome: '',
    cargo: '',
    rg: '',
    cpf: ''
  });
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setValues({
        id: state.id,
        nome: state.nome,
        cargo: state.cargo,
        rg: state.rg,
        cpf: state.cpf,
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

  const addFazenda = useCallback((idFazenda) => {
    setFazenda({
      ...fazenda,
      id: idFazenda
    });
  }, [setFazenda, fazenda]);

  const updateForm = useCallback(() => {
    api.put('funcionarios', {
      id: values.id,
      nome: values.nome,
      cargo: values.cargo,
      rg: values.rg,
      cpf: values.cpf,
      fazenda
    }).then(() => {
      toastSuccess('Funcionario alterado com sucesso');
      navigate('../../funcionarios');
    });

    setLoading(true);
  }, [values, fazenda, navigate]);

  const submitForm = useCallback(() => {
    api.post('funcionarios', {
      nome: values.nome,
      cargo: values.cargo,
      rg: values.rg,
      cpf: values.cpf,
      fazenda
    }).then(() => {
      toastSuccess('Funcionario cadastrado com sucesso');
      setValues({
        id: undefined,
        nome: '',
        cargo: '',
        rg: '',
        cpf: '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));

    setLoading(true);
  }, [values, fazenda]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader={state ? 'Editando funcionário' : 'Inserindo funcionário'}
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
        <FazendaSelect fazendaSelected={fazenda.id} addFazenda={addFazenda} />
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            disabled={!values.nome?.length}
            onClick={values.id ? updateForm : submitForm}
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
