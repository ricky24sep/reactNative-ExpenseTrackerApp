import { useLayoutEffect, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import IconButton from '../../components/UI/IconButton';
import ExpenseForm from '../../components/ManageExpense/ExpenseForm';
import { GlobalStyles } from '../../constants/styles';
import { ExpensesContext } from '../../store/expenses-context';
import { AuthContext } from '../../store/auth-context';
import { storeExpense, updateExpense, deleteExpense } from '../../utils/http';
import LoadingOverlay from '../../components/UI/LoadingOverlay';
import ErrorOverlay from '../../components/UI/ErrorOverlay';

function ManageExpense({ route, navigation }) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const expensesCtx = useContext(ExpensesContext);
    const authCtx = useContext(AuthContext);

    const selectedExpense = expensesCtx.expenses.find(
        (expense) => expense.id === editedExpenseId
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        });
    }, [navigation, isEditing]);

    async function deleteExpenseHandler() {
        setIsSubmitting(true);
        try {
            await deleteExpense(editedExpenseId, authCtx.token);
            expensesCtx.deleteExpense(editedExpenseId);
            navigation.goBack();
        } catch (error) {
            setError('Could not delete expenses - please try agian later!');
            setIsSubmitting(false);
        }
    }

    function cancelHandler() {
        navigation.goBack();
    }

    async function confirmHandler(expenseData) {
        setIsSubmitting(true);
        try {
            if (isEditing) {
                expensesCtx.updateExpense(editedExpenseId, expenseData);
                await updateExpense(editedExpenseId, authCtx.token, expenseData);
            } else {
                const id = await storeExpense(authCtx.token, expenseData);
                expensesCtx.addExpense({ ...expenseData, id: id});
            }
            navigation.goBack();
        } catch (error) {
            setError('Could not save data - please try again later!');
            setIsSubmitting(false);
        }
    }

    function errorHandler() {
        setError(null);
    }

    if (error && !isSubmitting) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />
    }

    if (isSubmitting) {
        return <LoadingOverlay />
    }

    return (
        <View style={styles.container}>
            <ExpenseForm 
                submitButtonLabel={isEditing ? 'Update' : 'Add'} 
                onSubmit={confirmHandler}
                onCancel={cancelHandler} 
                defaultValues={selectedExpense}
            />
            {isEditing && (
                <View style={styles.deleteContainer}>
                    <IconButton 
                        icon='trash' 
                        color={GlobalStyles.colors.error500} 
                        size={36} 
                        onPress={deleteExpenseHandler}
                    />
                </View>
            )}
        </View>
    );
}

export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
});