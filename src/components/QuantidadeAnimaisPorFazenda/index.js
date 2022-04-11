import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import api from 'src/service/api';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const QuantidadeAnimaisPorFazenda = ({ className, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const balancear = useCallback(() => {
    setLoading(true);
    api.post('/fazendas/balancear').then(() => {
      toast('Processo iniciado, você sera notificado quando finalizar');
    });
  }, []);

  useEffect(() => {
    api.get('fazendas/total-animais-por-fazenda').then((response) => {
      setData(response.data)
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading ? (<CircularProgress />) : (
        <>

          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <CardHeader title="Capacidade das fazendas" />
            <Divider />
            <PerfectScrollbar>
              <Box minWidth={800}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Fazenda
                      </TableCell>
                      <TableCell>
                        Quantidade ocupada
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((order) => (
                      <TableRow
                        hover
                        key={order.idFazenda}
                      >
                        <TableCell>
                          {order.nomeFazenda}
                        </TableCell>
                        <TableCell>
                          {order.totalAnimais}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
            <Box
              display="flex"
              justifyContent="flex-end"
              p={2}
            >
              <Button
                color="primary"
                endIcon={<ArrowRightIcon />}
                size="small"
                variant="text"
                onClick={balancear}
              >
                Balancear
              </Button>
            </Box>
          </Card>
        </>
      )}
    </>
  );
};

export default QuantidadeAnimaisPorFazenda;
