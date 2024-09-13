import axios from 'axios';
import { HeaderPost } from './Headers/Header';

axios.defaults.baseURL ='http://107.6.54.56:8080/api'
export const EmployeeService ={
    async getAll() {
        const res = await axios.get(`all`, HeaderPost);
        // console.log(res.data);
        return res.data;
    },

    async save(empleado) {
        const res = await axios.post(`save`, empleado, HeaderPost);
        console.log("esto se manda",res.data)
        return res.data;
    },

    async getInfo(id) {
        const res = await axios.get(`find/${id}`, HeaderPost);
        
        return res.data;
    },

    async delete(id) {
        const res = await axios.delete(`delete/${id}`,  HeaderPost );
        console.log(res.data);
        return res.data;
    }
}

