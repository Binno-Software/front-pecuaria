import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
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
  Button
} from '@material-ui/core';
import { Trash } from 'react-feather';
import CreateIcon from '@material-ui/icons/Create';
import api from 'src/service/api';
import { toastSuccess } from 'src/utils/toast';
import { useNavigate } from 'react-router';

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
  const fazendas = data.content;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const navigate = useNavigate();

  const handleClickOpen = (registro) => {
    setOpen(true);
    setSelectedItem(registro);
  };
  const update = useCallback((item) => {
    navigate(`../fazendas/${item.id}`, { replace: true, state: item });
  }, [navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  const excluir = useCallback(() => {
    api.delete(`fazendas/${selectedItem.id}`).then(() => {
      toastSuccess('Fazenda excluida');
      handleClose();
      window.location.reload();
    });
  }, [selectedItem]);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = fazendas.map((fazenda) => fazenda.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    reload(event.target.value, page);
  };

  const handlePageChange = (event, newPage) => {
    reload(limit, newPage);
  };

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
            <DialogTitle id="alert-dialog-title">Você tem certeza que quer excluir essa fazenda?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {selectedItem?.nome}
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
                    checked={selectedCustomerIds.length === fazendas.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < fazendas.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Nome
                </TableCell>
                <TableCell>
                  Código fazenda
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fazendas.slice(0, limit).map((fazenda) => (
                <TableRow
                  hover
                  key={fazenda.id}
                  selected={selectedCustomerIds.indexOf(fazenda.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(fazenda.id) !== -1}
                      onChange={(event) => handleSelectOne(event, fazenda.id)}
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
                        {fazenda.nome}
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
                        {fazenda.codigoEstab}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <CreateIcon onClick={() => update(fazenda)} />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Trash onClick={() => handleClickOpen(fazenda)} />
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
