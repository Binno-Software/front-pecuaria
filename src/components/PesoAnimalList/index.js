import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 200,
    width: 200
  }
}));

const initialPeso = {
  peso: 0,
  dataPesagem: moment().format('YYYY-MM-DD')
};

const PesoAnimaList = ({
  className, statePesos, addPeso, removerPeso, ...rest
}) => {
  const classes = useStyles();
  const [pesos, setPesos] = useState([]);
  const [peso, setPeso] = useState(initialPeso);

  useEffect(() => {
    if (statePesos?.length) {
      setPesos(statePesos);
    }
  }, [statePesos]);

  const handleChange = (event) => {
    setPeso({
      ...peso,
      [event.target.name]: event.target.value
    });
  };

  const handleAddPeso = (_peso) => {
    _peso.peso = parseFloat(_peso.peso);
    addPeso(_peso);
    setPeso(initialPeso);
  };

  // eslint-disable-next-line no-unused-vars
  const remove = useCallback((id) => {
    setPesos(pesos.filter((_peso) => _peso.id !== id));
    removerPeso(id);
  }, [pesos, removerPeso]);

  const disableButtonAdicionar = (_peso) => {
    return _peso <= 0;
  };

  return (
    <Box sx={{ width: '50%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {pesos.map((_peso) => (
          <Grid item xs={3}>
            <Card
              className={clsx(classes.root, className)}
              style={{ margin: 20 }}
              {...rest}
            >
              <CardContent>
                <TextField
                  fullWidth
                  disabled
                  label="Peso do animal"
                  margin="normal"
                  name="peso"
                  type="number"
                  value={_peso.peso}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  disabled
                  label="Data pessagem"
                  margin="normal"
                  name="dataPesagem"
                  type="date"
                  value={_peso.dataPesagem}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Adiciona peso */}
        <Card
          className={clsx(classes.root, className)}
          style={{ margin: 20, width: '225px' }}
          {...rest}
        >
          <CardContent>
            <TextField
              fullWidth
              label="Peso do animal"
              margin="normal"
              name="peso"
              type="number"
              onChange={handleChange}
              value={peso.peso}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Data pessagem"
              margin="normal"
              name="dataPesagem"
              type="date"
              onChange={handleChange}
              value={peso.dataPesagem}
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              fullWidth
              disabled={disableButtonAdicionar(peso.peso)}
              variant="text"
              onClick={() => handleAddPeso(peso)}
            >
              Adicionar peso
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Box>
  );
};

PesoAnimaList.propTypes = {
  className: PropTypes.string,
  statePesos: PropTypes.array,
  addPeso: PropTypes.func,
  removerPeso: PropTypes.func
};

export default PesoAnimaList;
