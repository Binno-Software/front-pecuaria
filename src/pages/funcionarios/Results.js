import React, { useCallback, useState } from 'react';
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
  Button
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'react-feather';
import api from 'src/service/api';
import { toastSuccess } from 'src/utils/toast';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, data, reload, page, limit, ...rest }) => {
  const classes = useStyles();
  const funcionarios = data.content;
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const handleClickOpen = registro => {
    setOpen(true);
    setSelectedItem(registro);
    console.log(registro)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const excluir = useCallback(() => {
    api.delete(`funcionarios/${selectedItem.id}`).then(() => {
      toastSuccess('Funcionario excluido');
      handleClose();
      window.location.reload()
    })
  }, [selectedItem])

  // eslint-disable-next-line
  const update = useCallback((item) => {
    navigate('../cadastro-funcionario', { replace: true, state: item })
  }, [navigate])

  const handleSelectAll = (event) => {
    let newSelectedIds;

    if (event.target.checked) {
      newSelectedIds = funcionarios.map((element) => element.id);
    } else {
      newSelectedIds = [];
    }

    setSelectedIds(newSelectedIds);
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
    reload(event.target.value, page)
  };

  const handlePageChange = (event, newPage) => {
    reload(limit, newPage)
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
            <DialogTitle id="alert-dialog-title">{"Você tem certeza que quer excluir esse Funcionario?"}</DialogTitle>
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
                    checked={selectedIds.length === funcionarios.length}
                    color="primary"
                    indeterminate={
                      selectedIds.length > 0
                      && selectedIds.length < funcionarios.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Nome
                </TableCell>
                <TableCell>
                  Cargo
                </TableCell>
                <TableCell>
                  CPF
                </TableCell>
                <TableCell>
                  Fazenda
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionarios.slice(0, limit).map((element) => (
                <TableRow
                  hover
                  key={element.id}
                  selected={selectedIds.indexOf(element.id) !== -1}
                  // onClick={() => update(element)}
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
                        {element.nome}
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
                        {element.cargo}
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
                        {element.cpf}
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
                        {element.fazenda.nome}
                      </Typography>
                    </Box>
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
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Registros por pagina"
      />
    </Card>
  );
};

export default Results;
