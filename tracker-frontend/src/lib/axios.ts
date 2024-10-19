import axios from 'axios'
import { URL } from '../constant'

export const axiosInstance = axios.create({
    baseURL: URL
})