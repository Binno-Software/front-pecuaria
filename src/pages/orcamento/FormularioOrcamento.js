import React, { useCallback, useState } from 'react';
import {
    Card,
    CardHeader,
    LinearProgress
} from '@material-ui/core';
import OrcamentoDetail from './OrcamentoDetail';
import ItemList from './Itemlist';
import api, { baseURL } from 'src/service/api';
import { useNavigate } from 'react-router-dom';
import { toastError, toastSuccess } from 'src/utils/toast';

const FormularioOrcamento = () => {
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [items, setItems] = useState([])
    const navigate = useNavigate()

    const atualizarOrcamento = items => {
        const total = items.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0)
        setTotal(total)
    }

    const finalizar = useCallback(() => {
        setLoading(true)
        api.post('orcamento', {
            itens: items,
            valorTotal: total
        }).then(({ data }) => {
            toastSuccess('orcamento adicionado')
            navigate('../orcamento', { replace: true })
            var win = window.open(`${baseURL}/orcamento/gerar-comprovante?id=${data.id}`, '_blank');
            win.focus();
        }).catch(() => {
            toastError('Ocorreu um erro ao gravar a orcamento tente novamente')
            setLoading(false)
        })

    }, [items, navigate, total])

    if (loading) {
        return <LinearProgress />
    }

    return (
        <Card>
            <CardHeader
                subheader="Cadastro orçamento" />
                <OrcamentoDetail 
                    total={total} 
                    finalizar={finalizar}/>
                <ItemList 
                    items={items}
                    setItems={setItems}
                    atualizarOrcamento={atualizarOrcamento} />
        </Card>
    )
}

export default FormularioOrcamento