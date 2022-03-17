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
import TipoMetragemSelect from 'src/components/TipoMetragemSelect';

const useStyles = makeStyles({
  root: {}
});

const CadastroFazenda = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    nome: undefined,
    codigoEstab: 0,
    endereco: '',
    metragem: 0,
    tipoMetragem: undefined,
    capacidadeMaxGado: 0
  });
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setValues({
        id: state.id,
        nome: state.nome,
        codigoEstab: state.codigoEstab,
        endereco: state.endereco,
        metragem: state.metragem,
        tipoMetragem: state.tipoMetragem,
        capacidadeMaxGado: state.capacidadeMaxGado
      });
    }
  }, [state]);

  const add = useCallback(
    (valor) => {
      setValues({
        ...values,
        tipoMetragem: valor
      });
    },
    [values]
  );

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = useCallback(() => {
    api
      .post('fazendas', {
        id: values.id,
        nome: values.nome,
        codigoEstab: values.codigoEstab,
        endereco: values.endereco,
        metragem: values.metragem,
        tipoMetragem: values.tipoMetragem,
        capacidadeMaxGado: values.capacidadeMaxGado
      })
      .then(() => {
        toastSuccess('Fazenda cadastrada com sucesso');
        setValues({
          nome: undefined,
          codigoEstab: 0,
          endereco: '',
          metragem: 0,
          tipoMetragem: values.tipoMetragem
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    setLoading(true);
  }, [values]);

  const update = useCallback(() => {
    api
      .put('fazendas', {
        id: values.id,
        nome: values.nome,
        codigoEstab: values.codigoEstab,
        endereco: values.endereco,
        metragem: values.metragem,
        tipoMetragem: values.tipoMetragem,
        capacidadeMaxGado: values.capacidadeMaxGado
      })
      .then(() => {
        toastSuccess('Fazenda editada com sucesso');
        navigate('../fazendas');
      });
  }, [values, navigate]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <form className={clsx(classes.root, className)} {...rest}>
      <Card>
        <CardHeader subheader={state ? 'Editando fazenda' : 'Inserindo fazenda'} title="Fazenda" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Nome"
            margin="normal"
            name="nome"
            required
            onChange={handleChange}
            type="text"
            value={values.nome}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Código fazenda"
            margin="normal"
            name="codigoEstab"
            onChange={handleChange}
            type="number"
            value={values.codigoEstab}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Endereço"
            margin="normal"
            name="endereco"
            onChange={handleChange}
            type="text"
            value={values.endereco}
            variant="outlined"
          />
          <TipoMetragemSelect tipoMetragemSelected={values.tipoMetragem} add={add} />
          <TextField
            fullWidth
            label="Tamanho da fazenda"
            margin="normal"
            name="metragem"
            onChange={handleChange}
            type="number"
            value={values.metragem}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Capacidade máxima de gado"
            margin="normal"
            name="capacidadeMaxGado"
            onChange={handleChange}
            type="number"
            value={values.capacidadeMaxGado}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            variant="contained"
            disabled={!values.nome?.length}
            onClick={values.id ? update : submitForm}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

CadastroFazenda.propTypes = {
  className: PropTypes.string
};

export default CadastroFazenda;
