import React, { useCallback, useState } from 'react';
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
import { toastSuccess } from 'src/utils/toast';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroCliente = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    nome: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = useCallback(() => {
    api.post('cliente', {
        nome: values.nome,
        telefone: values.telefone
    }).then(() => {
        toastSuccess('Cliente cadastrado com sucesso')
        setValues({
            nome: '',
            telefone: ''
        })
        setLoading(false)    
    })    

    setLoading(true)
  }, [values])

  if (loading) {
      return <LinearProgress/>
  }

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="inserindo novo cliente"
          title="Cliente"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="nome"
            margin="normal"
            name="nome"
            onChange={handleChange}
            type="text"
            value={values.nome}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="telefone"
            margin="normal"
            name="telefone"
            onChange={handleChange}
            type="text"
            value={values.telefone}
            variant="outlined"
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

CadastroCliente.propTypes = {
  className: PropTypes.string
};

export default CadastroCliente;
