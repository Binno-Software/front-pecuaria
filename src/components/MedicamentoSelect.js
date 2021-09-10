import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import api from 'src/service/api';

const useStyles = makeStyles(() => ({
  root: {}
}));

const MedicamentoSelect = ({
  addMedicamento, medicamentoSelected, className, ...rest
}) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [values, setValues] = useState({
    selecionado: undefined
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
    addMedicamento(event.target.value);
  };

  useEffect(() => {
    if (medicamentoSelected) {
      setValues({
        selecionado: medicamentoSelected.toString()
      });
    }
  }, [medicamentoSelected]);

  useEffect(() => {
    api.get('medicamentos/listagem').then((response) => {
      setData(response.data);
    });
  }, [addMedicamento]);

  useEffect(() => {
    if (!medicamentoSelected) {
      addMedicamento(data[0]?.id);
    }
  }, [data, addMedicamento, medicamentoSelected]);

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          title="Medicamento"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                name="selecionado"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.selecionado}
                variant="outlined"
              >
                {data.map((e) => (
                  <option
                    key={e.id}
                    value={e.id}
                  >
                    {e.nome}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

MedicamentoSelect.propTypes = {
  className: PropTypes.string,
  addMedicamento: PropTypes.func,
  medicamentoSelected: PropTypes.number
};

export default MedicamentoSelect;
