import axios from 'axios';

const API_KEY = 'AIzaSyBXfsEHLYWtUWkToJuXLLufRllE1Lro8bA';

async function authenticate(mode, email, password) {
    console.log('Username:', email);
    console.log('Password:', password);
    console.log('Mode:', mode);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`
    const response = await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true
    });
    console.log(response.data);
    return response.data.idToken;
}

export function createUser(email, password) {
    return authenticate('signUp', email, password);
}

export function login(email, password) {
    return authenticate('signInWithPassword', email, password);
}