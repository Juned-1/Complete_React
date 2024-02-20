import '@babel/polyfill';
import { login, logout } from "./login";
import { updateSettings } from './updateSettings';
//DOM Element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
//DELEGATION
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    //console.log(locations);
    //displayMap(locations)
}
if(loginForm){
    loginForm.addEventListener('submit', event => {
        event.preventDefault(); //prevents from loading any other pages
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email,password);
    });
}

if(logoutButton){
    logoutButton.addEventListener('click',logout);
}
if(userDataForm){
    userDataForm.addEventListener('submit',e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        updateSettings({name,email},'data');
    });
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        //update password takes time due to encryption so we will show updating unless it is finished
        document.querySelector('.btn--save-password').textContent = 'UPDATING...';
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent,password,passwordConfirm},'password');
        //after update
        document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';
        //clearing the filed after password changes
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value= '';
    });
}