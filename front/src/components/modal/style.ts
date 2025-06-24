import { StyleSheet } from 'react-native';
import { themes } from '../../../assets/colors/themes';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: themes.colors.white,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: '90%',
        flexDirection: 'column',
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
        gap: 12,
        paddingVertical: 10,
    },
    inputContainer: {
        gap: 4,
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
        height: 120,
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
    statusContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    statusButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    statusActive: {
        backgroundColor: themes.colors.primary,
        borderColor: themes.colors.primary,
    },
    statusInactive: {
        backgroundColor: themes.colors.white,
        borderColor: themes.colors.secondary,
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusActiveText: {
        color: themes.colors.white,
    },
    statusInactiveText: {
        color: themes.colors.secondary,
    },
    scrollContainer: {
        flex: 1,
        minHeight: 200,
    },
    scrollContent: {
        paddingBottom: 10,
    },
});
