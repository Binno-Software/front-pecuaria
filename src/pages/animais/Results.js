import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'react-feather';
import api, { baseURL } from 'src/service/api';
import { toastSuccess } from 'src/utils/toast';
import PropTypes from 'prop-types';
import useEnums from 'src/components/useEnums';
import getDescricaoEnum from 'src/utils/getDescricaoEnum';
import CreateIcon from '@material-ui/icons/Create';
import HealingIcon from '@material-ui/icons/Healing';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({
  className, data, reload, page, limit, ...rest
}) => {
  const classes = useStyles();
  const _data = data.content;
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [enumsRacaAnimal, setEnumsRacaAnimal] = useState([]);
  const [enumsEstadoAtual, setEnumsEstadoAtual] = useState([]);
  const [{ loadingEnum }, getGroupEnum] = useEnums();

  useEffect(() => {
    if (loadingEnum) {
      return;
    }
    setEnumsEstadoAtual(getGroupEnum('EstadoAtual'));
    setEnumsRacaAnimal(getGroupEnum('RacaAnimal'));
  }, [loadingEnum, getGroupEnum]);

  const handleClickOpen = (registro) => {
    setOpen(true);
    setSelectedItem(registro);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const excluir = useCallback(() => {
    api.delete(`animais/${selectedItem.id}`).then(() => {
      toastSuccess('Animal excluido');
      handleClose();
      window.location.reload();
    });
  }, [selectedItem]);

  const update = useCallback((item) => {
    navigate(`../animais/${item.id}`, { replace: true, state: item });
  }, [navigate]);

  const printProntuario = useCallback((item) => {
    const nav = window.open(`${baseURL}/prontuario/imprimir?animalId=${item.id}`);
    nav.focus();
  }, []);

  const handleSelectAll = (event) => {
    let newSelectedIds;

    if (event.target.checked) {
      newSelectedIds = _data.map((element) => element.id);
    } else {
      newSelectedIds = [];
    }

    setSelectedIds(newSelectedIds);
  };

  const handleSelectOne = (_event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = newSelectedIds.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedIds = newSelectedIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelectedIds(newSelectedIds);
  };

  const handleLimitChange = (event) => {
    reload(event.target.value, page);
  };

  const handlePageChange = (_event, newPage) => {
    reload(limit, newPage);
  };

  const order = () => {
    reload(limit, page, 'desc')
  };

  return (
    <>
      { !enumsRacaAnimal.length && !enumsEstadoAtual.length ? (<LinearProgress />) : (
        <Card
          className={clsx(classes.root, className)}
          {...rest}
        >
          <PerfectScrollbar>
            <Box minWidth={1050}>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Você tem certeza que quer excluir esse Animal?</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {selectedItem?.numero}
                    {' '}
                    {selectedItem?.raca}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Voltar
                  </Button>
                  <Button onClick={excluir} color="primary" autoFocus>
                    Excluir
                  </Button>
                </DialogActions>
              </Dialog>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.length === _data.length}
                        color="primary"
                        indeterminate={
                        selectedIds.length > 0
                        && selectedIds.length < _data.length
                      }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell onClick={order}>
                      Numero
                    </TableCell>
                    <TableCell>
                      Sexo
                    </TableCell>
                    <TableCell>
                      Raça
                    </TableCell>
                    <TableCell>
                      Estado Atual
                    </TableCell>
                    <TableCell>
                      Apelido
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_data.slice(0, limit).map((element) => (
                    <TableRow
                      hover
                      key={element.id}
                      selected={selectedIds.indexOf(element.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.indexOf(element.id) !== -1}
                          onChange={(event) => handleSelectOne(event, element.id)}
                          value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          alignItems="center"
                          display="flex"
                        >
                          <Typography
                            color="textPrimary"
                            variant="body1"
                          >
                            {element.numero}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          alignItems="center"
                          display="flex"
                        >
                          <Typography
                            color="textPrimary"
                            variant="body1"
                          >
                            {element.isFemea ? 'Femea' : 'Macho'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          alignItems="center"
                          display="flex"
                        >
                          <Typography
                            color="textPrimary"
                            variant="body1"
                          >
                            { getDescricaoEnum(enumsRacaAnimal, element.raca) }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          alignItems="center"
                          display="flex"
                        >
                          <Typography
                            color="textPrimary"
                            variant="body1"
                          >
                            {getDescricaoEnum(enumsEstadoAtual, element.estadoAtual)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          alignItems="center"
                          display="flex"
                        >
                          <Typography
                            color="textPrimary"
                            variant="body1"
                          >
                            {element.apelido}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <HealingIcon onClick={() => printProntuario(element)} />
                      </TableCell>
                      <TableCell padding="checkbox">
                        <CreateIcon onClick={() => update(element)} />
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Trash onClick={() => handleClickOpen(element)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={data.totalElements}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Registros por pagina"
          />
        </Card>
      )}
    </>

  );
};

Results.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  reload: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number,
};

export default Results;
