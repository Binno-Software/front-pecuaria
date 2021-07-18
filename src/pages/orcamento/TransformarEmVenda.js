import React, { useCallback, useState } from 'react';
import {
    Card,
    CardHeader,
    LinearProgress,
    Box,
    CardContent,
    Typography,
    Grid,
    TextField,
    Button
} from '@material-ui/core';
import api from 'src/service/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toastError, toastSuccess } from 'src/utils/toast';
import ClienteSelect from 'src/pages/vendas/ClienteSelect'

const TransformarEmVenda = () => {
    const [loading, setLoading] = useState(false)
    const [cliente, setCliente] = useState({})
    const { state } = useLocation();
    const orcamento = state
    const [valorRecebido, setValorRecebido] = useState(orcamento.valorTotal)
    const navigate = useNavigate()
    
    const finalizar = useCallback(() => {
        setLoading(true)
        api.post('orcamento/transformar', {
            clienteId: cliente,
            valorRecebido,
            orcamentoId: orcamento.id
        }).then(() => {
            toastSuccess('Venda criada')
            navigate('../vendas', { replace: true })
        }).catch(() => {
            toastError('Ocorreu um erro ao gravar tente novamente')
            setLoading(false)
        })

    }, [cliente, navigate, valorRecebido, orcamento])

    const addCliente = useCallback(id => {
        setCliente(id)
    }, [])

    if (loading) {
        return <LinearProgress />
    }

    return (
        <Card>
            <CardHeader subheader="Transformar orçamento em venda" />
            <Box mt={3}>
                <Card>
                    <CardContent>
                        <Box>
                            <Typography
                                align="left"
                                color="textPrimary"
                                gutterBottom
                                variant="h4"
                            > total R$: {orcamento.valorTotal}
                            </Typography>

                            <Card>
                                <CardHeader
                                    title="Informações do orçamento"
                                />

                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Valor Recebido pelo Cliente"
                                            name="valorRecebido"
                                            onChange={e => setValorRecebido(e.target.value)}
                                            type="number"
                                            value={valorRecebido}
                                            variant="outlined"
                                        />

                                    </Grid>
                                </CardContent>
                                <ClienteSelect addCliente={addCliente} />
                            </Card>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={finalizar}
                            > Transformar em venda </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Card>
    )
}

export default TransformarEmVenda