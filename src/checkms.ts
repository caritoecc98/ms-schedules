import axios from 'axios';

async function checkMS() {
    try{
        const payload=  {
            name: 'Juanita',
            lastName: 'Cortes',
            email: 'test222211@gmail.com',
            password: 'Test1234',
        }
        const url = "http://192.168.1.84:3000/api/v1/auth/register"
        const response = await axios.post(`${url}`, payload);
        console.log(response.status)
        if(response.status===201){
            console.log(response.status)
            console.log('MS CONECTADOS',response.data);
        }
        else{
            console.log('ERROR AL CONECTARSE CON MS',response.status);
        }
    }
    catch(error){
        console.log('ERROR MS CONECTADOS', error.message);
    }
    
}

export { checkMS };