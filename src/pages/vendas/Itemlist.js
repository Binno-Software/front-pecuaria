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

const useStyles = makeStyles(() => ({
    root: {},
    actions: {
        justifyContent: 'flex-end'
    }
}));

const ItemList = ({ atualizarVenda, items, setItems, className, ...rest }) => {
    const classes = useStyles();

    const addProduto = useCallback((produto) => {
        setItems([produto, ...items])
        atualizarVenda([produto, ...items])
    }, [items, atualizarVenda, setItems])

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <FormProduto addProduto={addProduto}/>
      
            <CardHeader title="Produtos no carrinho" />
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
                                    key={order.id}
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
