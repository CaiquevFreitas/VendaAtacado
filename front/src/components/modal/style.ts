import { StyleSheet } from 'react-native';
import { themes } from '../../../assets/colors/themes';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: themes.colors.white,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: themes.colors.primary,
    },
    closeButton: {
        padding: 5,
    },
    formContainer: {
        gap: 15,
    },
    inputContainer: {
        gap: 5,
    },
    label: {
        fontSize: 16,
        color: themes.colors.secondary,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: themes.colors.secondary,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10,
    },
    submitButton: {
        backgroundColor: themes.colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: themes.colors.secondary,
        borderRadius: 8,
        backgroundColor: themes.colors.white,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    imagePickerButton: {
        width: '100%',
        height: 150,
        borderWidth: 1,
        borderColor: themes.colors.secondary,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: themes.colors.white,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: themes.colors.secondary,
        fontSize: 14,
    },
});
