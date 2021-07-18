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

const useStyles = makeStyles(({
  root: {}
}));

const CadastroProduto = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    nome: '',
    ca: '',
    estoque: 0,
    valorVenda: 0,
    id: '',
    valorCompra: 0
  });
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { state } = useLocation();
  
  useEffect(() => {
    if (state) {
      setIsUpdate(true)
      setValues({
        nome: state.nome,
        ca: state.ca,
        estoque: state.estoque || 0,
        valorVenda: state.valorVenda || 0,
        valorCompra: state.valorCompra || 0,
        id: state.id
      })
    }

  }, [state])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

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

    api.post('produto', {
        nome: values.nome,
        ca: values.ca,
        estoque: values.estoque,
        valorVenda: values.valorVenda,
        valorCompra: values.valorCompra
    }).then(() => {
      toastSuccess('Produto cadastrado com sucesso')
        setValues({
            nome: '',
            ca: '',
            estoque: 0,
            valorVenda: 0,
            valorCompra: 0
        })
        setLoading(false)    
    })    

    setLoading(true)
  }, [values, isUpdate, updateForm])

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
          subheader="inserindo novo produto"
          title="Produto"
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
            label="CA"
            margin="normal"
            name="ca"
            onChange={handleChange}
            type="text"
            value={values.ca}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="estoque atual"
            margin="normal"
            name="estoque"
            onChange={handleChange}
            type="number"
            value={values.estoque}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="valor de venda"
            margin="normal"
            name="valorVenda"
            onChange={handleChange}
            type="number"
            value={values.valorVenda}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="valor de compra"
            margin="normal"
            name="valorCompra"
            onChange={handleChange}
            type="number"
            value={values.valorCompra}
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

CadastroProduto.propTypes = {
  className: PropTypes.string
};

export default CadastroProduto;
