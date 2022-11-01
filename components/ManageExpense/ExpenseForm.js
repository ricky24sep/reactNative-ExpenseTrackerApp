import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import Input from '../UI/Input';
import MultilineInput from '../UI/MultilineInput';
import Button from '../UI/Button';
import { getFormattedDate } from '../../utils/date';

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {

    const [inputValues, setInputValues] = useState({
        amount: defaultValues ? defaultValues.amount.toString() : '',
        date: defaultValues ? getFormattedDate(defaultValues.date) : '',
        description: defaultValues ? defaultValues.description : '',
    });

    function inputChangeHandler(inputIdentifier, enteredValue) {
        setInputValues((curInputValues) => {
            return {
                ...curInputValues,
                [inputIdentifier]: enteredValue
            }
        });
    }

    function submitHandler() {
        const expenseData = {
            amount: +inputValues.amount,
            date: new Date(inputValues.date),
            description: inputValues.description
        }

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
            Alert.alert('Invalid inputs', 'Please check your input values!');
            return;
        }

        onSubmit(expenseData);
    }

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your Expense</Text>
            <View style={styles.container}>
                <Input 
                    style={styles.rowInput}
                    label='Amount' 
                    textInputConfig={{
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangeHandler.bind(this, 'amount'),
                        value: inputValues.amount,
                    }} 
                />
                <Input 
                    style={styles.rowInput}
                    label='Date' 
                    textInputConfig={{
                        placeholder: 'YYYY-MM-DD',
                        maxLength: 10,
                        onChangeText: inputChangeHandler.bind(this, 'date'),
                        value: inputValues.date,
                    }} 
                />
            </View>
            <MultilineInput 
                label='Description' 
                textInputConfig={{
                    multiline: true,
                    onChangeText: inputChangeHandler.bind(this, 'description'),
                    value: inputValues.description,
                }}
            />
            <View style={styles.buttonsContainer}>
                <Button style={styles.button} mode='flat' onPress={onCancel}>
                    Cancel
                </Button>
                <Button style={styles.button} onPress={submitHandler} >
                    {submitButtonLabel}
                </Button>
            </View>
        </View>
    );
}

export default ExpenseForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 24,
        textAlign: 'center',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInput: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8,
    },
});