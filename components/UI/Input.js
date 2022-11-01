import { Text, TextInput, View, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

function Input({ label, style, textInputConfig }) {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} {...textInputConfig} />
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        marginHorizontal: 8,
        marginVertical: 16,
    },
    label: {
        fontSize: 14,
        color: GlobalStyles.colors.primary100,
        marginBottom: 4,
    },
    input: {
        backgroundColor: GlobalStyles.colors.primary100,
        color: GlobalStyles.colors.primary700,
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
    },
});