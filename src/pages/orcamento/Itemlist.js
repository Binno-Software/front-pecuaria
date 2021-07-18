import React, { useCallback } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardHeader,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    makeStyles,
} from '@material-ui/core';
import FormProduto from './FormProduto';
import { Trash } from 'react-feather';

const useStyles = makeStyles(() => ({
    root: {},
    actions: {
        justifyContent: 'flex-end'
    }
}));

const ItemList = ({ atualizarOrcamento, items, setItems, className, ...rest }) => {
    const classes = useStyles();

    const addProduto = useCallback((produto) => {
        produto.sequencial = `${items.length +1}/${produto.produtoId}`
        setItems([produto, ...items])
        atualizarOrcamento([produto, ...items])
    }, [items, atualizarOrcamento, setItems])

    const removeProduto = useCallback((produto) => {
        const produtosRestantes = items.filter(p => p.sequencial !== produto.sequencial)
        setItems(produtosRestantes)
        atualizarOrcamento(produtosRestantes)
    }, [items, setItems, atualizarOrcamento])

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <FormProduto addProduto={addProduto}/>
      
            <CardHeader title="Produtos no orçamento" />
            <Divider />
            <PerfectScrollbar>
                <Box minWidth={800}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Nome
                                </TableCell>
                                <TableCell>
                                    Ca
                                </TableCell>
                                <TableCell>
                                    Valor R$
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((order) => (
                                <TableRow
                                    hover
                                    key={order.sequencial}
                                >
                                    <TableCell>
                                        {order.nome}
                                    </TableCell>
                                    <TableCell>
                                        {order.ca}
                                    </TableCell>
                                    <TableCell>
                                        {order.valorUnitario}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            color="primary"
                                            label="pendente"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        <Trash onClick={() => removeProduto(order)} />
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
    );
};

ItemList.propTypes = {
    className: PropTypes.string
};

export default ItemList;
