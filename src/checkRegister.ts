import axios from 'axios';

async function checkReg(){
  const payload = {
    userId: 5,
    fecha: '2024-05-15',
    hora: '10:00'
  };
 
  try {
    const url = "http://192.168.1.84:3001/api/v1/auth/registerSchedule"
    const response = await axios.post(`${url}`, payload);
    console.log('Horario registrado:', response.data);
  } catch (error) {
    console.error('Error al registrar horario:');
  }
}

export { checkReg };
