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
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@material-ui/core';
import { DollarSign, Info } from 'react-feather';
import api from 'src/service/api';
import { toastSuccess } from 'src/utils/toast';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
        marginRight: theme.spacing(2)
    }
}));

const Results = ({ className, data, reload, page, limit, ...rest }) => {
    const classes = useStyles();
    const registers = data.content;
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const navigate = useNavigate()

    const detalhesTitulo = useCallback((titulo) => {
        navigate('../detalhamento-titulo', { replace: true, state: titulo })
      }, [navigate])

    const handleSelectAll = (event) => {
        let newSelectedIds;

        if (event.target.checked) {
            newSelectedIds = registers.map((reg) => reg.id);
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

    const handleClickOpen = registro => {
        if (registro.lock) return
        setOpen(true);
        setSelectedItem(registro);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const receber = useCallback(() => {
        api.put(`titulo-receber/${selectedItem.id}`).then(() => {
            toastSuccess('Recebimento concluido');
            handleClose();
            selectedItem.lock = true;
        })
    }, [selectedItem])

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
                        <DialogTitle id="alert-dialog-title">{"Você tem certeza que quer fazer esse recebimento?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Recebimento de R$ {selectedItem?.valor} do cliente {selectedItem?.clienteNome} gerado no dia {moment(selectedItem?.data).format('DD/MM/yyyy')}
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Voltar
                            </Button>
                            <Button onClick={receber} color="primary" autoFocus>
                                Receber
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedIds.length === registers.length}
                                        color="primary"
                                        indeterminate={
                                            selectedIds.length > 0
                                            && selectedIds.length < registers.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>
                                    Nome
                                </TableCell>
                                <TableCell>
                                    Valor R$
                                </TableCell>
                                <TableCell>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {registers.slice(0, limit).map((reg) => (
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
                                                {reg.clienteNome}
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
                                                {reg.valor}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        <Info onClick={() => detalhesTitulo(reg)} />
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        <DollarSign onClick={() => handleClickOpen(reg)} />
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
            />
        </Card>
    );
};

export default Results;
