import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from 'src/components/Toolbar';
import Results from './Results';
import api from '../../service/api';
import EmptyData from 'src/components/EmptyData';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const MedicamentosListView = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    api.get('medicamentos', {
      params: {
        size: limit,
        page
      }
    }).then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }, [limit, page]);

  const reload = useCallback((_limit, offset) => {
    setLoading(true);
    setLimit(_limit);
    setPage(offset);
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <Page
      className={classes.root}
      title="Medicamentos"
    >
      <Container maxWidth={false}>
        <Toolbar href="/app/cadastro-medicamento" title="medicamento" />
        {data.content.length > 0 ? (
          <Box mt={3}>
            <Results data={data} reload={reload} page={page} limit={limit} />
          </Box>
        ) : (
          <EmptyData />
        )}
      </Container>
    </Page>
  );
};

export default MedicamentosListView;
