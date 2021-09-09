import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import api from 'src/service/api';
import EmptyData from 'src/components/EmptyData';
import Toolbar from 'src/components/Toolbar';
import InputSearch from 'src/components/InputSearch';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const FazendaListView = () => {
  const classes = useStyles();
  const [fazendas, setFazendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('fazendas', {
      params: {
        size: limit,
        page,
        nome: filter
      }
    }).then((response) => {
      setFazendas(response.data);
      setLoading(false);
    });
  }, [limit, page, filter]);

  const reload = useCallback((_limit, offset) => {
    setLoading(true);
    setLimit(_limit);
    setPage(offset);
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <Page
      className={classes.root}
      title="Fazendas"
    >
      <Container maxWidth={false}>
        <Toolbar href="/app/fazendas/fazenda" title="fazenda" />
        <InputSearch setFilter={setFilter} />
        {fazendas.content.length > 0 ? (
          <>
            <Box mt={3}>
              <Results data={fazendas} reload={reload} page={page} limit={limit} />
            </Box>
          </>
        ) : (
          <EmptyData />
        )}

      </Container>
    </Page>
  );
};

export default FazendaListView;
