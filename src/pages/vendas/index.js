import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  makeStyles,
  Box,
  LinearProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import Results from './Results';
import api from '../../service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Vendas = () => {
  const classes = useStyles();
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  useEffect(() => {
      api.get('venda/paginated', {
        params: {
          limit: limit,
          offset: page
        }
      }).then(response => {
        setVendas(response.data)
        setLoading(false)
      })
  }, [limit, page])

  const reload = useCallback((limit, offset) => {
    setLoading(true)
    setLimit(limit)
    setPage(offset)
  }, [])

  if (loading) 
    return <LinearProgress  />

  return (
    <Page
      className={classes.root}
      title="Vendas"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results data={vendas.content} reload={reload} page={page} limit={limit} total={vendas.totalElements} />
        </Box>
      </Container>
    </Page>
  );
};

export default Vendas;
