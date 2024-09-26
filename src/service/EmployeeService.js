import axios from 'axios';


axios.defaults.baseURL ='https://stagingbacklaravel-production.up.railway.app/api/'
export const EmployeeService ={
    async getAll() {
        const res = await axios.get(`admin/asistencia`);
        // console.log(res.data);
        return res.data;
    },

    async save(empleado) {
        const res = await axios.post(`asistencia/resgistrar`, empleado);
        console.log("esto se manda",res.data)
        return res.data;
    },

    async getInfo(id) {
        const res = await axios.get(`admin/asistencia/${id}`);
        
        return res.data;
    },

    async put(id) {
        const res = await axios.put(`admin/asistencia/${id}`);
        console.log(res.data);
        return res.data;
    }
}

