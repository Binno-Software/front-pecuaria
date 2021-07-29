import React from 'react';
import { Typography, Grid } from '@material-ui/core';

const Dash = () => {
  return (
    <>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: '90vh' }}
      >
        <Grid item xs={6}>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            Binno Agro - Alpha version
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            Sistema para gerenciamento de fazendas
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            Produto em fase de desenvolvimento.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Dash;
