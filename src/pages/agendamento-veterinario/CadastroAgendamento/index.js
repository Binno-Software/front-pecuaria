import React, { useCallback, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@material-ui/core';
import api from 'src/service/api';
import { toastError, toastSuccess } from 'src/utils/toast';
import moment from 'moment';
import PeriodoDiaSelect from 'src/components/PeriodoDiaSelect';
import MedicamentoSelect from 'src/components/MedicamentoSelect';
import Disponibilidade from '../Disponibilidades';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroAgendamento = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    periodoDia: 'MANHA',
    veterinarioId: 0,
    dataAgendamento: moment().format('YYYY-MM-DD'),
    medicamentosId: []
  });
  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamentoSelected, setSelectedMedicamento] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const addPeriodo = useCallback(
    (valor) => {
      setValues({
        ...values,
        periodoDia: valor
      });
    },
    [values]
  );

  const changeMedicamento = useCallback(
    (_medicamento) => {
      setSelectedMedicamento(_medicamento)
    },
    [setSelectedMedicamento]
  );

  const addMedicamento = useCallback(
    () => {
      const finded = medicamentos.find(med => med === medicamentoSelected)
      if (finded) {
        toastError('Medicamento Já adicionado')
        return
      }

      setMedicamentos([medicamentoSelected, ...medicamentos])
      setValues({
        ...values,
        medicamentosId: [medicamentoSelected, ...medicamentos]
      });
    },
    [medicamentos, medicamentoSelected, values]
  );

  const submitForm = useCallback(() => {
    api.post('agendamento-veterinario', {
      periodoDia: values.periodoDia,
      veterinarioId: values.veterinarioId,
      dataAgendamento: values.dataAgendamento,
      medicamentosId: values.medicamentosId
    }).then(() => {
      toastSuccess('Agendamento Registrado');
      setValues({
        periodoDia: 'MANHA',
        veterinarioId: 0,
        dataAgendamento: moment().format('YYYY-MM-DD'),
        medicamentosId: []
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
          subheader="Novo Agendamento"
          title="Agendamentos"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Data de agendamento"
            margin="normal"
            name="dataAgendamento"
            onChange={handleChange}
            type="date"
            value={values.dataAgendamento}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
          />
          <Disponibilidade dataPesquisa={values.dataAgendamento}/>
          <PeriodoDiaSelect add={addPeriodo} />

          <Paper className={classes.paper}>
            <MedicamentoSelect addMedicamento={changeMedicamento} />
            <Button
              color="primary"
              variant="contained"
              onClick={addMedicamento}
            >
              Adicionar
            </Button>
          </Paper>

          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <Divider />
            <PerfectScrollbar>
              <Box minWidth={800}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        ID
                      </TableCell>
                      <TableCell>
                        Descrição
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicamentos.map((med) => (
                      <TableRow
                        hover
                        key={med}
                      >
                        <TableCell>
                          {med}
                        </TableCell>
                        <TableCell>
                          {''}
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
            </Box>
          </Card>
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
            onClick={submitForm}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

CadastroAgendamento.propTypes = {
  className: PropTypes.string
};

export default CadastroAgendamento;
