import React, { useCallback, useState } from 'react';
import {
    Card,
    CardHeader,
    LinearProgress
} from '@material-ui/core';
import VendasDetail from './VendasDetail';
import ItemList from './Itemlist';
import api from 'src/service/api';
import { useNavigate } from 'react-router-dom';
import ClienteSelect from './ClienteSelect';
import { toastError, toastSuccess } from 'src/utils/toast';

const CadastroVenda = () => {
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [valorRecebido, setValorRecebido] = useState(0)
    const [items, setItems] = useState([])
    const [cliente, setCliente] = useState(undefined)
    const navigate = useNavigate()

    const atualizarVenda = items => {
        const total = items.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0)
        setTotal(total)
        setValorRecebido(total)
    }

    const finalizar = useCallback(() => {
        setLoading(true)
        api.post('venda', {
            cliente,
            valorRecebido,
            itens: items
        }).then(() => {
            toastSuccess('venda cadastrada')
            navigate('../vendas', { replace: true })
        }).catch(() => {
            toastError('Ocorreu um erro ao gravar a venda tente novamente')
            setLoading(false)
        })

    }, [items, navigate, cliente, valorRecebido])

    const addCliente = useCallback(id => {
        setCliente(id)
    }, [])

    if (loading) {
        return <LinearProgress />
    }

    return (
        <Card>
            <CardHeader
                subheader="Cadastro venda" />
                <VendasDetail 
                    total={total} 
                    valorRecebido={valorRecebido} 
                    setValorRecebido={setValorRecebido}
                    finalizar={finalizar}/>
                <ClienteSelect addCliente={addCliente}/>
                <ItemList 
                    items={items}
                    setItems={setItems}
                    atualizarVenda={atualizarVenda} />
        </Card>
    )
}

export default CadastroVenda