import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    makeStyles
} from '@material-ui/core';
import api from 'src/service/api';

const useStyles = makeStyles(() => ({
    root: {}
}));

const FormProduto = ({ addProduto, className, ...rest }) => {
    const classes = useStyles();
    const [produtos, setProdutos] = useState([]);
    const [values, setValues] = useState({
        quantidade: undefined,
        valorUnitario: undefined,
        produtoSelecionado: undefined
    });

    const handleChange = (event) => {
        if (event.target.name === 'produtoSelecionado') {
            const reg = produtos.filter(prod => prod.id === event.target.value)
            setValues({
                ...values,
                valorUnitario: reg[0].valorCompra,
                [event.target.name]: event.target.value
            });
            return
        }

        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    useEffect(() => {
        api.get('produto').then(response => {
            setProdutos(response.data)
            
        })
    }, [])

    const add = useCallback(() => {
        let prod
        if (values.produtoSelecionado) {
            const find = produtos.filter(prod => prod.id === values.produtoSelecionado)
            prod = find[0]
        } else {
            prod = produtos[0]
        }
        
        const produto = {
            produtoId: prod.id,
            quantidade: values.quantidade || 1,
            valorUnitario: values.valorUnitario || 0,
            nome: prod.nome,
            ca: prod.ca
        }
        addProduto(produto)
    }, [values, produtos, addProduto])

    return (
        <form
            autoComplete="off"
            noValidate
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Card>
                <CardHeader
                    title="Produto"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                name="produtoSelecionado"
                                onChange={handleChange}
                                required
                                select
                                SelectProps={{ native: true }}
                                value={values.produtoSelecionado}
                                variant="outlined"
                            >
                                {produtos.map((produto) => (
                                    <option
                                        key={produto.id}
                                        value={produto.id}
                                    >
                                        {produto.nome}-{produto.ca}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Quantidade"
                                name="quantidade"
                                onChange={handleChange}
                                type="number"
                                value={values.quantidade}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Valor"
                                name="valorUnitario"
                                onChange={handleChange}
                                required
                                type="number"
                                value={values.valorUnitario}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
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
                        onClick={add}
                    >
                        Adicionar produto
          </Button>
                </Box>
            </Card>
        </form>
    );
};

FormProduto.propTypes = {
    className: PropTypes.string
};

export default FormProduto;
