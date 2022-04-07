import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import CardTotalizadorBySexo from 'src/components/CardTotalizadorBySexo';
import QuantidadeAnimaisPorFazenda from 'src/components/QuantidadeAnimaisPorFazenda';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dash = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <CardTotalizadorBySexo isFemea />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <CardTotalizadorBySexo />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={12}
            sm={6}
            xl={12}
            xs={12}
          >
            <QuantidadeAnimaisPorFazenda />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dash;
