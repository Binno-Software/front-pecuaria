import axios from 'axios'
import { toastError } from 'src/utils/toast'

export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api-open-cloud-erp.herokuapp.com'

const instance = axios.create({
    baseURL
})

instance.interceptors.response.use((response) => {
    return response
}, (error) => {
    console.log(error.response?.data)

    if (!error.response){
        toastError('Erro interno')
        throw error
    }
        
    const messages = error.response.data.details || null
    if (messages) {
        messages.forEach(element => {
            toastError(element)    
        });
    }

    throw error
})

export default instance 