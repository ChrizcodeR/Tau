import axios from 'axios';
import { HeaderPost } from './Headers/Header';

axios.defaults.baseURL = 'http://107.6.54.56:8080/api/schedule'
 
export const ScheduleService = {
    async getAllSchedule() {
        const res = await axios.get(`all`, HeaderPost);
        return res.data
    },

    async saveSchedule(schedule) {
      try {
        const res = await axios.post(`save`, schedule, HeaderPost );
        return res.data;
      } catch (error) {
        console.log(error.response);
      }
        
    },
   
    async delete(id) {
        try {
          const res = await axios.delete(`delete/${id}`, HeaderPost );
          if (res.status === 200) {
            return true;
          } else {
            throw new Error('Error al eliminar el registro');
          }
        } catch (error) {
          throw error;
        }
      }
}

