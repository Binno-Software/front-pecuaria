import React, { useState, useCallback } from 'react';
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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';
import moment from 'moment';
import { Share2, Trash } from 'react-feather';
import api, { baseURL } from '../../service/api'
import { toastSuccess } from 'src/utils/toast';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, data, reload, page, limit, total, ...rest }) => {
  const classes = useStyles();
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const handleSelectAll = (event) => {
    let newSelectedIds;

    if (event.target.checked) {
      newSelectedIds = data.map((reg) => reg.id);
    } else {
      newSelectedIds = [];
    }

    setSelectedIds(newSelectedIds);
  };

  const handleClickOpen = registro => {
    setOpen(true);
    setSelectedItem(registro);
    console.log(registro)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectOne = (event, id) => {
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

  const handlePageChange = (event, newPage) => {
    reload(limit, newPage);
  };

  const generateReport = useCallback((id) => {
    var win = window.open(`${baseURL}/venda/gerar-comprovante?id=${id}`, '_blank');
    win.focus();
  }, [])

  const excluir = useCallback(() => {
    api.delete(`venda/${selectedItem.id}`).then(() => {
      toastSuccess('Venda excluida');
      handleClose();
      reload(limit, page);
    })
  }, [selectedItem, limit, page, reload])

  return (
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
            <DialogTitle id="alert-dialog-title">{"Você tem certeza que quer excluir essa venda?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Venda de R$ {selectedItem?.valorTotal} para o cliente {selectedItem?.cliente?.nome}
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
                    checked={selectedIds.length === data.length}
                    color="primary"
                    indeterminate={
                      selectedIds.length > 0
                      && selectedIds.length < data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Data
                </TableCell>
                <TableCell>
                  Cliente
                </TableCell>
                <TableCell>
                  Total
                </TableCell>
                <TableCell>

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, limit).map((reg) => (
                <TableRow
                  hover
                  key={reg.id}
                  selected={selectedIds.indexOf(reg.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.indexOf(reg.id) !== -1}
                      onChange={(event) => handleSelectOne(event, reg.id)}
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
                        {moment(reg.dataVenda).format('DD/MM/yyyy')}
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
                        {reg.cliente?.nome}
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
                        R$ {reg.valorTotal}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Trash onClick={() => handleClickOpen(reg)} />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Share2 onClick={() => generateReport(reg.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default Results;
