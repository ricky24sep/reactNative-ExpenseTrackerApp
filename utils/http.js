import axios from 'axios';

const BASE_URL = 'https://expense-tracker-app-3133d-default-rtdb.firebaseio.com'

export async function storeExpense(token, expenseData) {
    const response = await axios.post( 
        BASE_URL + `/expenses.json?auth=${token}`, expenseData
    );
    const id = response.data.name;
    return id;
}

export async function fetchExpenses(token) {
    const response = await axios.get(
        BASE_URL + `/expenses.json?auth=${token}`
    );
    console.log(response.data);

    const expenses = [];
    for (const key in response.data) {
        const expenseObj = {
            id: key,
            amount: response.data[key].amount,
            date: new Date(response.data[key].date),
            description: response.data[key].description
        };
        expenses.push(expenseObj);
    }

    return expenses;
}

export async function updateExpense(id, token, expenseData) {
    return axios.put(
        BASE_URL + `/expenses/${id}.json?auth=${token}`, expenseData
    )
}

export async function deleteExpense(id, token) {
    return axios.delete(
        BASE_URL + `/expenses/${id}.json?auth=${token}`
    )
}