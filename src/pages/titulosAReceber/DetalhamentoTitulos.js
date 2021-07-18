import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    makeStyles,
    LinearProgress,
    colors
} from '@material-ui/core';
import { Printer, DollarSign } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { baseURL } from '../../service/api';
import { toastSuccess } from 'src/utils/toast';

const useStyles = makeStyles(() => ({
    root: {},
    actions: {
        justifyContent: 'flex-end'
    },
    redColor: {
        color: colors.red[900],
    },
    orangeColor: {
        color: colors.orange[600],
    },
    alertBadge: {
        backgroundColor: colors.orange[600],
    }
}));

const DetalhamentoTitulos = ({ className, ...rest }) => {
    const classes = useStyles();
    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const [titulos, setTitulos] = useState([])
    const [title] = useState(`Detalhes das dividas do cliente ${state.clienteNome}`)
    const navigate = useNavigate()
    
    useEffect(() => {
        api.get('titulo-receber/detalhamento', {
            params: {
                clienteId: state.clienteId,
            }
        }).then(response => {
            setTitulos(response.data)
            setLoading(false)
        })
    }, [state])

    const print = useCallback((id) => {
        var win = window.open(`${baseURL}/venda/gerar-comprovante?id=${id}`, '_blank');
        win.focus();
    }, [])

    const gerarComprovante = useCallback(() => {
        const id = state.clienteId
        var win = window.open(`${baseURL}/relatorios/detalhamento?clienteId=${id}`, '_blank');
        win.focus();
    }, [state.clienteId])

    const quitarTodos = useCallback(() => {
        setLoading(true)
        api.put(`titulo-receber/${state.clienteId}/quitar-todos`).then(() => {
            toastSuccess('Todos os titulos foram quitados')
            navigate('../titulos-a-receber', { replace: true })
        })
    }, [state.clienteId, navigate])

    if (loading)
        return <LinearProgress />

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardHeader title={title} />
            <Divider />
            <PerfectScrollbar>
                <Box minWidth={800}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Valor da divida
                                </TableCell>
                                <TableCell>
                                    Valor da venda
                                </TableCell>
                                <TableCell sortDirection="desc">
                                    <Tooltip
                                        enterDelay={300}
                                        title="Sort"
                                    >
                                        <TableSortLabel
                                            active
                                            direction="desc"
                                        >
                                            Data
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {titulos.map((order) => (
                                <TableRow
                                    hover
                                    key={order.tituloAReceber.id}
                                >
                                    <TableCell>
                                        {order.venda.valorTotal}
                                    </TableCell>
                                    <TableCell>
                                        {order.tituloAReceber.valor}
                                    </TableCell>
                                    <TableCell>
                                        {moment(order.venda.dataVenda).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            className={classes.alertBadge}
                                            label="PENDENTE"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        <Printer onClick={() => print(order.venda.id)} />
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
                    className={classes.orangeColor}
                    endIcon={<Printer />}
                    size="small"
                    variant="text"
                    onClick={gerarComprovante}
                >
                    Imprimir relação
                </Button>
                <Button
                    className={classes.redColor}
                    endIcon={<DollarSign />}
                    size="small"
                    variant="text"
                    onClick={quitarTodos}
                >
                    Quitar todos
                </Button>
            </Box>
        </Card>
    );
};

export default DetalhamentoTitulos;
