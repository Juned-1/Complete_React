import axios from "axios";
import { showAlert } from "./alert";
export const login = async (email,password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data : {
                email,
                password
            }
        }); //axios return promise
        if(res.data.status === 'success'){
            showAlert('success','Logged In successfulyy');
            window.setTimeout(() => {
                location.assign('/');
            },1500);
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}
export const logout = async () => {
    try{
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        }); //It is ajax request
        if(res.data.status === 'success'){
            //It will send empty invalid cookie to server during reload, which will automatically make it out logout
            location.reload(true); //setting it true will reload website from server and not from browser cache
        }
    }catch(err){
        showAlert('error', "Error logging out! Try again.")
    } 
}