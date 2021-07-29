import React, { useState } from 'react';
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

const useStyles = makeStyles(() => ({
  root: {}
}));

const TipoMetragemSelect = ({ add, className, ...rest }) => {
  const classes = useStyles();
  const [data] = useState([
    {
      id: 'HECTARE',
      desc: 'Hectare'
    },
    {
      id: 'ALQUEIRE',
      desc: 'Alqueire'
    }
  ]);
  const [values, setValues] = useState({
    selecionado: undefined
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
    add(event.target.value);
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader title="Tipo de medida" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
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
                {data.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.desc}
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

TipoMetragemSelect.propTypes = {
  className: PropTypes.string
};

export default TipoMetragemSelect;
