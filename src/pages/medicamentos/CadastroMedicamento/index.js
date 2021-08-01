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
  LinearProgress,
} from '@material-ui/core';
import api from 'src/service/api';
import { toastSuccess } from 'src/utils/toast';
import moment from 'moment';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroMedicamento = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    nome: '',
    descricao: '',
    dataValidade: moment().format('YYYY-MM-DD')
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = useCallback(() => {
    api.post('medicamentos', {
      nome: values.nome,
      descricao: values.descricao,
      dataValidade: values.dataValidade
    }).then(() => {
      toastSuccess('Medicamento cadastrado com sucesso');
      setValues({
        nome: '',
        descricao: '',
        dataValidade: moment().format('YYYY-MM-DD')
      });
      setLoading(false);
    }).catch(() => setLoading(false));

    setLoading(true);
  }, [values]);

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
          subheader="Inserindo novo Medicamento"
          title="Medicamento"
        />
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
            multiline
            rows={4}
            rowsMax={4}
            label="Descricao"
            margin="normal"
            name="descricao"
            onChange={handleChange}
            type="text"
            value={values.descricao}
            variant="outlined"
            inputProps={{
              maxLength: 500
            }}
          />
          <TextField
            fullWidth
            label="Data de valdiade"
            margin="normal"
            name="dataValidade"
            onChange={handleChange}
            type="date"
            value={values.dataValidade}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
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
            disabled={!values.nome?.length}
            onClick={submitForm}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

CadastroMedicamento.propTypes = {
  className: PropTypes.string
};

export default CadastroMedicamento;
