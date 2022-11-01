import { Text, TextInput, View, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

function MultilineInput({ label, textInputConfig }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} {...textInputConfig} />
        </View>
    );
}

export default MultilineInput;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 4,
        marginVertical: 16,
    },
    label: {
        fontSize: 13,
        color: GlobalStyles.colors.primary100,
        marginBottom: 4,
    },
    input: {
        backgroundColor: GlobalStyles.colors.primary100,
        color: GlobalStyles.colors.primary700,
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
        minHeight: 100,
        textAlignVertical: 'top',
    },
});