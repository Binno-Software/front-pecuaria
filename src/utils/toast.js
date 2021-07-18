import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

toast.configure()

export const toastSuccess = message => toast(message);

export const toastError = message => toast.error(message)