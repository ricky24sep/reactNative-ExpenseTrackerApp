import { createContext, useReducer } from 'react';

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({ description, amount, date }) => {},
    setExpenses: (expenses) => {},
    deleteExpense: (id) => {},
    updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
    switch(action.type) {
        case 'ADD':
            const id = new Date().toString() + Math.random.toString();
            return [action.payload, ...state];
        case 'SET':
            return action.payload.reverse();
        case 'UPDATE':
            const expenseIndex = state.findIndex(
                (expense) => expense.id === action.payload.id
            );
            const prevExpenseItem = state[expenseIndex];
            const updatedExpenseItem = { ...prevExpenseItem, ...action.payload.data };
            const updatedExpenses = [...state];
            updatedExpenses[expenseIndex] = updatedExpenseItem;
            return updatedExpenses;
        case 'DELETE':
            return state.filter((expense) => expense.id !== action.payload);
        default:
            return state;
    }
}

function ExpensesContextProvider({ children }) {
    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    function addExpense(expenseData) {
        dispatch({ type: 'ADD', payload: expenseData });
    }

    function setExpenses(expenses) {
        dispatch({ type: 'SET', payload: expenses });
    }

    function deleteExpense(id) {
        dispatch({ type: 'DELETE', payload: id });
    }

    function updateExpense(id, expenseData) {
        dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData }});
    }

    const value = {
        expenses: expensesState,
        addExpense: addExpense,
        setExpenses: setExpenses,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense
    };

    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

export default ExpensesContextProvider;